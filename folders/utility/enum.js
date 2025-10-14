require('dotenv').config();

const ROLES = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    STAFF: "STAFF",
};

const S3FOLDERMAP = {
    pdf: 'FILES',
    xls: 'FILES',
    xlsx: 'FILES',
    png: 'IMAGES',
    svg: 'IMAGES',
    jpg: 'IMAGES',
    jpeg: 'IMAGES',
    mp4: 'VIDEOS',
    mov: 'VIDEOS',
    mkv: 'VIDEOS',
    flv: 'VIDEOS'
}

const ALLOWEDTYPES = ['jpeg', 'png', 'jpg', 'svg', 'csv', 'xls', 'xlsx', 'pdf', 'mp4', 'mov', 'mkv', 'flv'];

const NOTIFICATION_TYPES = ["comment", "like", "mention", "system"]

const ROUTE_PREFIX = `/${process.env.SUBDOMAIN}/${process.env.VERSION}`;

module.exports = { ROLES, ALLOWEDTYPES, S3FOLDERMAP, ROUTE_PREFIX, NOTIFICATION_TYPES };