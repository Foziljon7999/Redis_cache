import { AuthController } from "@controllers/authController"
import { CitiesController } from "@controllers/citiesController"
import { CountriesController } from "@controllers/countriesController"
import { Router } from "express"

let router: Router = Router()

// Auth
router.post("/auth/send-code", AuthController.SendCode)
router.post("/auth/verify-code", AuthController.VerifyCode)

// Countries
router.get("/countries/all", CountriesController.GetAllCountries)
router.post("/countries/create", CountriesController.CreateCountries)
router.patch("/countries/update", CountriesController.UpdateCountry)
router.delete("/countries/delete/:id", CountriesController.DeleteCountry)

// Cities
router.get("/cities/all", CitiesController.GetAllCities)
router.post("/cities/create", CitiesController.CreateCities)
router.patch("/cities/update", CitiesController.UpdateCity)
router.delete("/cities/delete/:id", CitiesController.DeleteCity)




export default router