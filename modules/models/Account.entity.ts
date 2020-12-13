export type Account = {
  id: string
  compoundId?: string
  userId: string
  providerType: string
  providerId: string
  providerAccountId: string
  refreshToken: string | null
  accessToken: string | null
  accessTokenExpires: number | null
  createdAt: number
  updatedAt: number
}
