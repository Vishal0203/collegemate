export const READ_NOTIFICATION_REQUEST = 'READ_NOTIFICATION_REQUEST';
export const READ_ALL_NOTIFICATIONS_REQUEST = 'READ_ALL_NOTIFICATIONS_REQUEST';
export const READ_NOTIFICATION_RESPONSE = 'READ_NOTIFICATION_RESPONSE';
export const READ_ALL_NOTIFICATIONS_RESPONSE = 'READ_ALL_NOTIFICATIONS_RESPONSE';
export const OPEN_CATEGORY_ANNOUNCEMENTS = 'OPEN_CATEGORY_ANNOUNCEMENTS';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

export function readNotificationRequest(notificationIds, url) {
  return {
    type: READ_NOTIFICATION_REQUEST,
    notificationIds,
    url
  }
}

export function readAllNotificationsRequest(url) {
  return {
    type: READ_ALL_NOTIFICATIONS_REQUEST,
    url
  }
}

export function readNotificationResponse(notificationIds) {
  return {
    type: READ_NOTIFICATION_RESPONSE,
    notificationIds
  }
}
export function readAllNotificationsResponse() {
  return {
    type: READ_ALL_NOTIFICATIONS_RESPONSE
  }
}

export function openCategoryAnnouncements(announcementGuid) {
  return {
    type: OPEN_CATEGORY_ANNOUNCEMENTS,
    announcementGuid
  }
}

export function newNotification(notification) {
  return {
    type: NEW_NOTIFICATION,
    notification
  }
}

