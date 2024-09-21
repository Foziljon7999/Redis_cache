import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { createClient } from "redis";
import { ErrorHandler } from '@errors'

let prisma = new PrismaClient()

export class CountriesController {
    static async GetAllCountries(req: Request, res: Response, next: NextFunction) {
        try {
            let redis = createClient()
            await redis.connect()
            let countries = await redis.get("countries")
            if (countries) {
                res.json({
                    success: true,
                    data: JSON.parse(countries)
                })
            } else {
                let countriesData = await prisma.country.findMany()
                redis.setEx("countries", 20, JSON.stringify(countriesData))
                res.json({
                    success: true,
                    data: countriesData
                })
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async CreateCountries(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body
            let redis = createClient()
            await redis.connect()
            const countries = await prisma.country.create({ data: { name } })
            await redis.del('countries')
            res.status(200).json({
                success: true,
                message: "Created Country",
                data: countries
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async UpdateCountry(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name } = req.body
            let redis = createClient()
            await redis.connect()
            const updatedCountry = await prisma.country.update({
                where: { id: Number(id) },
                data: { name }
            })
            await redis.del('countries')
            res.status(200).send({
                success: true,
                message: "Updated Country",
                data: updatedCountry
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))

        }
    }

    static async DeleteCountry(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            let redis = createClient()
            await redis.connect()
            const deleteCountry = await prisma.country.delete({ where: { id: Number(id) } })
            await redis.del('countries')
            res.status(200).send({
                success: true,
                message: "Deleted Country",
                data: deleteCountry
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}