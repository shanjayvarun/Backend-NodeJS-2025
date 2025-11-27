const environment = require('../../config/env.config')

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

const LEADSTATUS = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost', 'Follow-Up']

const DEALSTAGES = [
    "Lead Discovered",
    "Contact Initiated",
    "Needs Identified",
    "Meeting Arranged",
    "Offer Accepted",
    "Closed Won",
    "Closed Lost"
]

const DEALSTATUSFLAGS = ["open", "won", "lost"]

const ALLOWEDTYPES = ['jpeg', 'png', 'jpg', 'svg', 'csv', 'xls', 'xlsx', 'pdf', 'mp4', 'mov', 'mkv', 'flv'];

const NOTIFICATION_TYPES = ["comment", "like", "mention", "system"]

const ROUTE_PREFIX = `/${environment.version}`;

module.exports = { ROLES, ALLOWEDTYPES, S3FOLDERMAP, ROUTE_PREFIX, NOTIFICATION_TYPES, LEADSTATUS, DEALSTAGES, DEALSTATUSFLAGS };