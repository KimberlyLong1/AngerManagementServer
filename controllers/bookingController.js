const router = require("express").Router(); // way to merge lines 1 and 2! 
let validateJWT = require("../middleware/validate-session")
const { BookingModel  } = require("../model")

// Create a booking
router.post("/", validateJWT, async (req, res) =>{
    const { id } = req.user;

    try {
        const createBooking = await BookingModel.create({
            contactFirstName: req.body.contactFirstName,
            constactLastName: req.body.constactLastName,
            packageNumber: req.body.packageNumber,
            quanity: req.body.quanity,
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            totalCost: req.body.totalCost,
            owner_id: id 
        });

        console.log(createBooking)

        res.status(201).json({
            message: "Event successfully created",
            createBooking
        })

    } catch(err) {
        res.status(500).json({
            message: `Failed to create booking ${err}`
        })
    }
})

// UPDATE BOOKING: 

router.put("/:id", validateJWT, async (req, res) => {
    const ownerid = req.user.id
      const {
          contactFirstName,
          constactLastName,
          packageNumber,
          quanity,
          eventDate,
          eventTime,
          totalCost,
          
      } = req.body //faster way one lines 27-33. destructuring object. 
  
      try {
          await BookingModel.update(
              { contactFirstName, constactLastName, packageNumber, quanity, eventDate, eventTime, totalCost},
              { where: { id: req.params.id, owner_id: ownerid}, returning: true } //looking to update where the id in our database matches the id in our endpoint // return the effect that rose
          )
          .then((result) => {
              res.status(200).json({
                  message: "Event successfully updated.",
                  updatedBooking: result 
              })
          })
      } catch (err) {
          res.status(500).json({
              message: `Failed to update event ${err}`
          })
      }
  })

  // GET ALL EVENTS ---- I DON'T THINK I WANT THIS

router.get("/", async (req, res) => { // one / = just one route
    try {
     const allEvents = await BookingModel.findAll()  //searches for multiple instances of bookings..asynchronous method, so use await. 
     console.log(allBookings)
 
     res.status(200).json(allBookings)
 
    } catch(err) {
 
        res.status(500).json({
            error: err
        })
 
    }
 }) 

 // GET BOOKINGS BY USER--- YES!

 router.get("/:owner_id", validateJWT, async (req, res) => {
    let {owner_id} = req.params;
    try {
        const userBookings = await BookingModel.findAll({
            where: {
                owner_id: owner_id == 0 ? req.user.id : owner_id
                
            }
        });
        res.status(200).json(userBookings);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});   

// GET BOOKINGS BY PACKAGE NUMBER 

router.get("/packageNumber/:packageNumber", async (req, res) => {
    const { packageNumber } = req.params;
    try {
        const results = await BookingModel.findAll({
            where: { packageNumber: packageNumber }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

// DELETE BOOKING

router.delete("/:id", validateJWT, async (req, res) =>{
    const ownerid = req.user.id; 
    
    try { 
      

      await BookingModel.destroy({
          where: {id: req.params.id, owner_id: ownerid}
      })

      res.status(200).json({
          message: "Booking successfully deleted"

      })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete booking ${err}`
        })
    }

})

module.exports = router;