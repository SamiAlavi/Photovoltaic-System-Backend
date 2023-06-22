import { Router, Response } from 'express';
import projectService from "../services/projectService";
import AppSettings from '../../AppSettings';
import { ICustomRequest, IProductAddRequest, IProductDeleteRequest, IProductReportGenerateRequest, IProductUpdateRequest, IProjectCreateRequest, IProjectDeleteRequest } from '../shared/requestsInterfaces';
import Helpers from '../shared/helpers';
import { IProductAddResponse, IProductDeleteResponse, IProductReportGenerateResponse, IProductUpdateResponse, IProjectCreateResponse, IProjectDeleteResponse, IProjectsGetResponse } from '../shared/responsesInterfaces';

const router = Router();

/**
 * @swagger
 * paths:
 *   /:
 *     get:
 *       summary: Get user projects
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful response with projects
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectsGetResponse'
 */
router.get(AppSettings.RouteBase, async (req: ICustomRequest, res: IProjectsGetResponse) => {
    try {
        const userUid = req.userUid;
        const projects = await projectService.getProjects(userUid);
        res.json(projects);
    }
    catch (error: any) {
        Helpers.handleError(res, error);
    }
});

/**
 * @swagger
 * paths:
 *   /:
 *     post:
 *       summary: Create project
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProjectCreateRequest'
 *       responses:
 *         '200':
 *           description: Project created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectCreateResponse'
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
 *   /:
 *     delete:
 *       summary: Delete project
 *       tags:
 *         - Projects
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProjectDeleteRequest'
 *       responses:
 *         '200':
 *           description: Project deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProjectDeleteResponse'
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
 *   /product:
 *     post:
 *       summary: Add product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductAddRequest'
 *       responses:
 *         '200':
 *           description: Product addition successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductAddResponse'
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
 *   /product:
 *     put:
 *       summary: Edit product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductUpdateRequest'
 *       responses:
 *         '200':
 *           description: Product edit successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductUpdateResponse'
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
 *   /product:
 *     delete:
 *       summary: Delete product
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProductDeleteRequest'
 *       responses:
 *         '200':
 *           description: Product deletion successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IProductDeleteResponse'
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
 *   /product/report:
 *     post:
 *       summary: Generate product report
 *       tags:
 *         - Project's Products
 *       security:
 *         - BearerAuth: []
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
