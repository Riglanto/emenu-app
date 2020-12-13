// followed from next-auth repo: https://github.com/nextauthjs/next-auth
// create faunadb server key
// create collections: users, accounts, sessions, verificationRequests
// create required indexes 


import { query as q, Expr } from 'faunadb';
import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';
import { User } from '~/modules/models/User.entity';
import { Account } from '~/modules/models/Account.entity';
import { Session } from '~/modules/models/Session.entity';
import { VerificationRequest } from '~/modules/models/VerificationRequest.entity';
import { serverClient, Idx } from '..';
import { Adapter } from 'next-auth/adapters';


function faunaWrapper<T>(faunaQ: Expr, errorTag) {
    try {
        return serverClient.query<T>(faunaQ);
    } catch (error) {
        console.error(errorTag, error);
        return Promise.reject(new Error(`${errorTag}, ${error}`));
    }
}

const FaunaAdapter = (config, options = {}): Adapter => {
    async function getAdapter(appOptions) {
        if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
            console.log('no default options for session');
        }

        const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
        const sessionMaxAge =
            appOptions && appOptions.session && appOptions.session.maxAge
                ? appOptions.session.maxAge * 1000
                : defaultSessionMaxAge;
        const sessionUpdateAge =
            appOptions && appOptions.session && appOptions.session.updateAge
                ? appOptions.session.updateAge * 1000
                : 24 * 60 * 60 * 1000;

        async function createUser(profile: User) {
            console.log('-----------createUser------------');
            // console.log(profile);
            return faunaWrapper<User>(
                q.Select(
                    'data',
                    q.Create(q.Collection('users'), {
                        data: {
                            ...profile,
                            emailVerified: profile.emailVerified
                                ? profile.emailVerified.toISOString()
                                : null,
                            id: uuidv4(),
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        },
                    }),
                ),
                'CREATE_USER_ERROR',
            );
        }

        async function getUser(id: User['id']) {
            console.log('-----------getUser------------');
            // console.log(id);
            return faunaWrapper(
                q.Select('data', q.Get(q.Match(q.Index(Idx.USERS_ID), id))),
                'GET_USER_BY_ID_ERROR',
            );
        }

        async function getUserByEmail(email: string) {
            console.log('-----------getUserByEmail------------');
            // console.log(email);
            return faunaWrapper(
                q.Let(
                    {
                        ref: q.Match(q.Index(Idx.USERS_EMAIL), email),
                    },
                    q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
                ),
                'GET_USER_BY_EMAIL_ERROR',
            );
        }

        async function getUserByProviderAccountId(providerId: string, providerAccountId: string) {
            console.log('-----------getUserByProviderAccountId------------');
            // console.log(providerId, providerAccountId);

            return faunaWrapper(
                q.Let(
                    {
                        ref: q.Match(q.Index(Idx.USERS_ACCOUNT_ID_PROVIDER_ID), [
                            providerId,
                            providerAccountId,
                        ]),
                    },
                    q.If(
                        q.Exists(q.Var('ref')),
                        q.Select(
                            'data',
                            q.Get(
                                q.Match(
                                    q.Index(Idx.USERS_ID),
                                    q.Select('userId', q.Select('data', q.Get(q.Var('ref')))),
                                ),
                            ),
                        ),
                        null,
                    ),
                ),
                'GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR',
            );
        }

        async function updateUser(user: User) {
            console.log('-----------updateUser------------');
            // console.log(user);
            return faunaWrapper(
                q.Select(
                    'data',
                    q.Update(q.Select('ref', q.Get(q.Match(q.Index(Idx.USERS_ID), user.id))), {
                        data: {
                            ...user,
                            updatedAt: Date.now(),
                            emailVerified: user.emailVerified
                                ? user.emailVerified.toISOString()
                                : null,
                        },
                    }),
                ),
                'UPDATE_USER_ERROR',
            );
        }

        async function linkAccount(
            userId: User['id'],
            providerId: string,
            providerType: string,
            providerAccountId: string,
            refreshToken: string,
            accessToken: string,
            accessTokenExpires: number,
        ): Promise<void> {
            console.log('-----------linkAccount------------');
            const account: Account = {
                userId,
                providerId,
                providerType,
                providerAccountId,
                refreshToken,
                accessToken,
                accessTokenExpires,
                id: uuidv4(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            return faunaWrapper(
                q.Select(
                    'data',
                    q.Create(q.Collection('accounts'), {
                        data: account,
                    }),
                ),
                'LINK_ACCOUNT_ERROR',
            );
        }

        async function createSession(user: User) {
            console.log('-----------createSession------------');
            let expires: string = null;
            if (sessionMaxAge) {
                const dateExpires = new Date();
                dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
                expires = dateExpires.toISOString();
            }

            const session: Session = {
                expires,
                userId: user.id,
                sessionToken: randomBytes(32).toString('hex'),
                accessToken: randomBytes(32).toString('hex'),
                id: uuidv4(),
                createdAt: Date.now(),
                updatedAt: Date.now()
            }

            return faunaWrapper(
                q.Select(
                    'data',
                    q.Create(q.Collection('sessions'), {
                        data: session,
                    }),
                ),
                'CREATE_SESSION_ERROR',
            );
        }

        async function getSession(sessionToken: string) {
            console.log('-----------getSession------------');
            // console.log(sessionToken);

            const session = await serverClient.query<Session | null>(
                q.Let(
                    {
                        ref: q.Match(q.Index(Idx.SESSIONS_SESSION_TOKEN), sessionToken),
                    },
                    q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
                ),
            );
            // Check session has not expired (do not return it if it has)
            if (session?.expires && new Date().toISOString() > session.expires) {
                await serverClient.query(
                    q.Delete(
                        q.Select(
                            'ref',
                            q.Get(q.Match(q.Index(Idx.SESSIONS_SESSION_TOKEN), sessionToken)),
                        ),
                    ),
                );
                return null;
            }

            return session;
        }

        async function updateSession(session: Session, force: boolean) {
            console.log('-----------updateSession------------');
            // console.log(session, force);
            if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
                // Calculate last updated date, to throttle write updates to database
                // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
                //     e.g. ({expiry date} - 30 days) + 1 hour
                //
                // Default for sessionMaxAge is 30 days.
                // Default for sessionUpdateAge is 1 hour.
                const dateSessionIsDueToBeUpdated = new Date(session.expires);
                dateSessionIsDueToBeUpdated.setTime(
                    dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge,
                );
                dateSessionIsDueToBeUpdated.setTime(
                    dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge,
                );

                // Trigger update of session expiry date and write to database, only
                // if the session was last updated more than {sessionUpdateAge} ago
                if (new Date() > dateSessionIsDueToBeUpdated) {
                    const newExpiryDate = new Date();
                    newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
                    session.expires = newExpiryDate.toISOString();
                } else if (!force) {
                    return null;
                }
            } else {
                // If session MaxAge, session UpdateAge or session.expires are
                // missing then don't even try to save changes, unless force is set.
                if (!force) {
                    return null;
                }
            }

            const { id, expires } = session;
            return faunaWrapper(
                q.Update(q.Select('ref', q.Get(q.Match(q.Index(Idx.SESSIONS_ID), id))), {
                    data: {
                        expires,
                        updatedAt: Date.now(),
                    },
                }),
                'UPDATE_SESSION_ERROR',
            );
        }

        async function deleteSession(sessionToken: string) {
            console.log('-----------deleteSession------------');
            // console.log(sessionToken);

            return faunaWrapper<void>(
                q.Delete(
                    q.Select(
                        'ref',
                        q.Get(q.Match(q.Index(Idx.SESSIONS_SESSION_TOKEN), sessionToken)),
                    ),
                ),
                'DELETE_SESSION_ERROR',
            );
        }

        async function createVerificationRequest(identifier: string, url: string, token: string, secret: string, provider) {
            console.log('-----------createVerificationRequest------------');
            // console.log((identifier, url, token, secret, provider));
            try {
                const { baseUrl } = appOptions;
                const { sendVerificationRequest, maxAge } = provider;

                // Store hashed token (using secret as salt) so that tokens cannot be exploited
                // even if the contents of the database is compromised.
                // @TODO Use bcrypt function here instead of simple salted hash
                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                console.log('created token', hashedToken)
                let expires = null;
                if (maxAge) {
                    const dateExpires = new Date();
                    dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
                    expires = dateExpires.toISOString();
                }
                const request: VerificationRequest = {
                    identifier,
                    token: hashedToken,
                    expires,
                    id: uuidv4(),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }
                // Save to database
                const verificationRequest = await serverClient.query(
                    q.Create(q.Collection('verificationRequests'), {
                        data: request,
                    }),
                );

                // With the verificationCallback on a provider, you can send an email, or queue
                // an email to be sent, or perform some other action (e.g. send a text message)
                await sendVerificationRequest({ identifier, url, token, baseUrl, provider });

                return verificationRequest;
            } catch (error) {
                return Promise.reject(new Error(`CREATE_VERIFICATION_REQUEST_ERROR ${error}`));
            }
        }

        async function getVerificationRequest(identifier: string, token: string, secret: string, provider) {
            console.log('-----------getVerificationRequest------------');
            try {
                // Hash token provided with secret before trying to match it with database
                // @TODO Use bcrypt instead of salted SHA-256 hash for token
                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                console.log('read token', hashedToken)
                const verificationRequest = await serverClient.query<VerificationRequest>(
                    q.Let(
                        {
                            ref: q.Match(q.Index(Idx.VERIFICATION_REQUESTS_TOKEN), hashedToken),
                        },
                        q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
                    ),
                );
                console.log('damn', verificationRequest)
                if (
                    verificationRequest?.expires &&
                    Date.now() > verificationRequest.expires
                ) {
                    // Delete verification entry so it cannot be used again
                    await serverClient.query(
                        q.Delete(
                            q.Select(
                                'ref',
                                q.Get(
                                    q.Match(
                                        q.Index(Idx.VERIFICATION_REQUESTS_TOKEN),
                                        hashedToken,
                                    ),
                                ),
                            ),
                        ),
                    );
                    return null;
                }

                return verificationRequest;
            } catch (error) {
                console.error('GET_VERIFICATION_REQUEST_ERROR', error);
                return Promise.reject(new Error(`GET_VERIFICATION_REQUEST_ERROR ${error}`));
            }
        }

        async function deleteVerificationRequest(identifier, token, secret, provider) {
            console.log('-----------deleteVerificationRequest------------');
            try {
                // Delete verification entry so it cannot be used again
                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                await serverClient.query(
                    q.Delete(
                        q.Select(
                            'ref',
                            q.Get(q.Match(q.Index(Idx.VERIFICATION_REQUESTS_TOKEN), hashedToken)),
                        ),
                    ),
                );
            } catch (error) {
                console.error('DELETE_VERIFICATION_REQUEST_ERROR', error);
                return Promise.reject(new Error(`DELETE_VERIFICATION_REQUEST_ERROR ${error}`));
            }
        }

        return Promise.resolve({
            createUser,
            getUser,
            getUserByEmail,
            getUserByProviderAccountId,
            updateUser,
            linkAccount,
            createSession,
            getSession,
            updateSession,
            deleteSession,
            createVerificationRequest,
            getVerificationRequest,
            deleteVerificationRequest,
        });
    }

    return {
        getAdapter,
    };
};

export default {
    Adapter: FaunaAdapter,
};
