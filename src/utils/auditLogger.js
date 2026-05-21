import prisma from "../config/prisma.js";

/**
 * Log an administrative/editing action in the audit logs.
 * @param {string} userId - The user performing the action
 * @param {string|null} projectId - The associated project (optional)
 * @param {string} action - The action type (e.g. CREATE, UPDATE, DELETE)
 * @param {string} entityType - The type of entity (e.g. Project, Module, Task, Dependency)
 * @param {string} entityId - The ID of the modified entity
 * @param {string} description - Brief details of what was changed
 */
export const logAction = async (userId, projectId, action, entityType, entityId, description) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        projectId: projectId || null,
        action,
        entityType,
        entityId,
        description,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};
