import * as notificationsService from "./notifications.service.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user.id);
    res.json({ message: "Notificaciones obtenidas", data: notifications });
  } catch (error) { next(error); }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationsService.markAsRead(req.user.id, req.params.id);
    res.json({ message: "Notificación marcada como leída", data: notification });
  } catch (error) { next(error); }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await notificationsService.markAllAsRead(req.user.id);
    res.json({ message: "Todas marcadas como leídas" });
  } catch (error) { next(error); }
};

export const deleteNotification = async (req, res, next) => {
  try {
    await notificationsService.deleteNotification(req.user.id, req.params.id);
    res.json({ message: "Notificación eliminada" });
  } catch (error) { next(error); }
};
