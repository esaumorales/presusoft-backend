import prisma from "../../config/prisma.js";

export const getNotifications = async (userId) => {
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
};

export const markAsRead = async (userId, id) => {
  const notification = await prisma.notification.findFirst({ where: { id, userId } });
  if (!notification) throw new Error("Notification not found");
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
};

export const deleteNotification = async (userId, id) => {
  return prisma.notification.delete({ where: { id, userId } });
};
