const requestStatusEnum = ['Pending', 'Approved', 'Rejected'];
const notificationTypeEnum = ["Action", "Message"];
const constants = {
    REQUEST_STATUS: { pending: requestStatusEnum[0], approved: requestStatusEnum[1], rejected: requestStatusEnum[2] },
    NOTIFICATION_TYPE: { action: notificationTypeEnum[0], message: notificationTypeEnum[1] },
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[@#$!%*?&-]).{8,}$/,
    RESULT_PER_PAGE: 20,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}
const DEFAULT_PASSWORD = "123@ Abcdef";

module.exports = {
    constants,
    requestStatusEnum,
    notificationTypeEnum
}