import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { ErrorHandler } from '@errors'

const prisma = new PrismaClient()

export class CitiesController {
    static async GetAllCities(req: Request, res: Response, next: NextFunction) {
        try {
            let redis = createClient()
            await redis.connect()
            let cities = await redis.get("cities")
            if (cities) {
                res.json({
                    success: true,
                    data: JSON.parse(cities)
                })
            } else {
                let citiesData = await prisma.city.findMany()
                redis.setEx('cities', 20, JSON.stringify(citiesData))
                res.json({
                    success: true,
                    data: citiesData
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async CreateCities(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, country_id } = req.body
            let redis = createClient()
            await redis.connect()
            const createCity = await prisma.city.create({
                data: { name, country_id }
            })

            await redis.del('cities')
            res.status(200).json({
                success: true,
                message: "Created city",
                data: createCity
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async UpdateCity(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name, country_id } = req.body
            let redis = createClient()
            await redis.connect()
            const updatedCity = await prisma.country.update({
                where: { id: Number(id) },
                data: { name }
            })

            await redis.del('cities')
            res.status(200).json({
                success: true,
                message: "Updated city",
                data: updatedCity
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async DeleteCity(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            let redis = createClient()
            await redis.connect()

            const deletedCity = await prisma.city.delete({ where: { id: Number(id) } })

            await redis.del('cities')
            res.status(200).json({
                success: true,
                message: "Deleted city",
                data: deletedCity
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.static))
        }
    }
}