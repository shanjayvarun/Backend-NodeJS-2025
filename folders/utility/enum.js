const TASKSTATUS = {
    NEW: 'NEW',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED'
}

const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
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

module.exports = { TASKSTATUS, ROLES, ALLOWEDTYPES, S3FOLDERMAP };