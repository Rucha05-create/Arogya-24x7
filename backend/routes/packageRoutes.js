const express = require("express")

const router = express.Router()

const Package = require(
  "../models/Package"
)

router.get(
  "/",

  async (
    req,
    res
  ) => {

    try {

      const data =
        await Package.find()

      res.json(
        data
      )

    }

    catch (error) {

      res
        .status(500)
        .json({

          message:
            error.message

        })

    }

  }

)

module.exports =
router