import { Router } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProductAddRequest, IProductDeleteRequest, IProductReportGenerateRequest, IProductUpdateRequest, IProjectCreateRequest, IProjectDeleteRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';
import { IProductAddResponse, IProductDeleteResponse, IProductReportGenerateResponse, IProductUpdateResponse, IProjectCreateResponse, IProjectDeleteResponse, IProjectsGetResponse } from '../shared/responsesInterfaces';

const router = Router();

/**
 * @swagger
 * paths:
 *   /project:
 *     get:
 *       summary: Get user projects
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       responses:
 *         '200':
 *           description: Successful response with projects
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectsGetResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: IProjectsGetResponse) => {
    try {
        const userUid = req.userUid;
        const projects = await projectService.getProjects(userUid);
        res.status(200).json(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project:
 *     post:
 *       summary: Create project
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProjectCreateRequest'
 *       responses:
 *         '201':
 *           description: Project created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectCreateResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.post(AppSettings.RouteBase, async (req: IProjectCreateRequest, res: IProjectCreateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        const project = projectService.createProject(userUid, projectId);
        res.status(201).json(project);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project:
 *     delete:
 *       summary: Delete project
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProjectDeleteRequest'
 *       responses:
 *         '204':
 *           description: Project deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectDeleteResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.delete(AppSettings.RouteBase, async (req: IProjectDeleteRequest, res: IProjectDeleteResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId } = req.body;
        projectService.deleteProject(userUid, projectId);
        res.status(204).json(true);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project/product:
 *     post:
 *       summary: Add product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductAddRequest'
 *       responses:
 *         '201':
 *           description: Product addition successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductAddResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.post(AppSettings.RouteAddEditDeleteProduct, async (req: IProductAddRequest, res: IProductAddResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.addProductInProject(userUid, projectId, product);
        res.status(201).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project/product:
 *     put:
 *       summary: Edit product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductUpdateRequest'
 *       responses:
 *         '204':
 *           description: Product edit successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductUpdateResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.put(AppSettings.RouteAddEditDeleteProduct, async (req: IProductUpdateRequest, res: IProductUpdateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.editProductInProject(userUid, projectId, product);
        res.status(204).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project/product:
 *     delete:
 *       summary: Delete product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductDeleteRequest'
 *       responses:
 *         '204':
 *           description: Product deletion successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductDeleteResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.delete(AppSettings.RouteAddEditDeleteProduct, async (req: IProductDeleteRequest, res: IProductDeleteResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        projectService.deleteProductInProject(userUid, projectId, product);
        res.status(204).json({ message: "Success" });
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /project/product/report:
 *     post:
 *       summary: Generate product report for last 30 days
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *         - X-UID: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductReportGenerateRequest'
 *       responses:
 *         '200':
 *           description: Product report generated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductReportGenerateResponse'
 *         '400':
 *           $ref: '#/components/responses/ErrorResponse'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedResponse'
 */
router.post(AppSettings.RouteProductReport, async (req: IProductReportGenerateRequest, res: IProductReportGenerateResponse) => {
    try {
        const userUid = req.userUid;
        const { projectId, product } = req.body;
        const reportData = await projectService.generateProductReport(userUid, projectId, product);
        res.status(200).json(reportData);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

export default router;
