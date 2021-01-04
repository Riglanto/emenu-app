import { readFileSync } from 'fs-extra';
import * as sass from 'sass';
import QRCode from 'qrcode'
import * as AWS from "aws-sdk";
import faunadb from "faunadb";
import path from 'path';
import { getSections } from '../../components/sections';

const q = faunadb.query;


const BUCKET_NAME = 'emenu.today'
const aws_config = {
    accessKeyId: process.env.AWS_ID,

    secretAccessKey: process.env.AWS_SECRET
}
const s3 = new AWS.S3(aws_config);
const cf = new AWS.CloudFront(aws_config);

export const getUserData = async (client, email) => {
    const search: any = await client.query(q.Map(
        q.Paginate(q.Match(q.Index("users_by_email"), email)),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
    ))
    if (search.data.length > 0) {
        return search.data[0].data;
    }
    return null;
}

export const generateMenuHtml = async (domain: string, title: string, sections: any) => {
    const url = `https://${domain}.emenu.today`
    const content = getSections(sections);
    const css = sass.renderSync({ file: path.join(process.cwd(), "styles", "sections.scss") }).css.toString();
    const template = readFileSync(path.join(process.cwd(), "template.html"), 'utf8')
    const qr = await QRCode.toString(url, { type: "svg", width: 200, margin: 1 })
    const result = template
        .replace(/{TITLE}/g, title)
        .replace("{SECTIONS}", content)
        .replace("{STYLES}", `<style>${css}</style>`)
        .replace("{QR}", qr)
    return result;
}

export const upload = async (domain: string, content: string) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${domain}/index.html`,
        Body: content
    };
    const result = await s3.upload(params).promise()
    // console.log(result)
}

export const invalidate = async (domain: string) => {
    const params = {
        DistributionId: process.env.AWS_CF_DISTRIBUTION_ID,
        InvalidationBatch: {
            CallerReference: new Date().getTime().toString(),
            Paths: {
                Quantity: 1,
                Items: [
                    `/*`,
                ]
            }
        }
    }
    const result = await cf.createInvalidation(params).promise()
    return result.Invalidation.Id
}

export const getInvalidationStatus = async (id: string) => {
    const params = {
        DistributionId: process.env.AWS_CF_DISTRIBUTION_ID,
        Id: id
    };
    const result = await cf.getInvalidation(params).promise()
    return result.Invalidation.Status
}