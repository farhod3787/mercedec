const express = require('express');
const Orders = require('../models/orders');
const Admin = require('../models/admin');
const Users = require('../models/users');
// const multer = require('multer');
// var fs = require('fs');
const router = express.Router();

// const MIME_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg'
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype];
//         let error = new Error("Errorrr");
//         if (isValid) {
//             error = null;
//         }
//         cb(error, "backend/images");
//     },
//     filename: (req, file, cb) => {
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIME_TYPE_MAP[file.mimetype];
//         cb(null, name + '-' + Date.now() + '.' + ext);
//     }
// })

router.post('/:token' , async(request, response, next) => {
    var body = request.body;
    var token = request.params.token;
    var users = await Users.find();
 
    var obj = Users.verifyOfUser(users, token);
    var order = {
        user_id: body.user_id,
        address: body.address,
        date: body.date,
        status: "Waiting",
        products: body.products,
        quantity: body.quantity,
        pay_type: body.pay_type,
        general_sum: body.general_sum
    }
    var new_order = new Orders(order);

    if (obj.isUser) {  
        new_order.save().then(res => {
            response.status(200).json(res);
        }).catch(err => {
            console.log(err);
            response.status(400).json({ message: "Error in Saved Order" })
        })
    } else {
        response.status(400).json({ message: "This is not User" });
    }
});



router.get('/getall/:token', async(request, response, next) => {
    
    var token = request.params.token;
    var admins = await Admin.find();

    var obj = await Admin.verifyOfAdmin(admins, token);

    if(obj.isAdmin) {
    let orders = await Orders.find();
    // if (pharms.logo) {
    //     pharms.logo = "/files/" + pharms.logo;
    // }

    response.status(200).json(orders)
    
}
    // var pharms = [];
    // Pharmacy.find().then( (all)=>{
    //     for(let i=all.length-1; i>=0; i--){
    //             pharms.push(all[i]);
    //     }
    //     response.status(200).json(pharms);
    // }).catch( (err) =>{
    //     console.log(err);
    //     response.status(400).json({message: "Error in Get Pharms"});
    // })

})

 
router.get('/getOrder/:id/:token', async function(request, response, next) {

    var id = request.params.id;
    var token = request.params.token;
        var admins = Admin.find();
        var obj = Admin.verifyOfAdmin(admins, token);

        if(obj.isModerator) {
                await Orders.findById(id).then((res) => {
                if (!res) {
                    response.status(400).json({ message: "Product Not found" });
                } else {
                    response.status(200).json(res);
                }
            }).catch((err) => {
                console.log(err);
                response.status(400).json({ message: "Product Not found" });
            })

        }
        else {
            response.status(400).json({ message: "It's not moderator" });
        }
})

router.delete('/deleteOrder/:id/:token', async function(request, response, next) {
    var id = request.params.id;
    var token = request.params.token;
    var admin = await Admin.find();

    var obj = Admin.verifyOfAdmin(admin, token);
    if (obj.isModerator) {
            await Orders.findByIdAndDelete(id).then((res) => {
                response.status(200).json({ message: "Order deleted!" });
            })
            .catch((err) => {
                console.log(err);
                response.status(400).json({ message: "Error in delete Order" });
            })
    } else {
        console.log(obj)
        response.status(400).json({ message: "This is not Moderator" });
    }
})

// router.patch('/updateProduct/:id/:token', multer({ storage: storage }).single('image'), async function(request, response, next) {
//     var id = request.params.id;
//     var body = request.body;

//     body.logo = request.file.filename;

//     var token = request.params.token;
//     var admin = await Admin.find();

//     var obj = Admin.verifyOfAdmin(admin, token);
//     if (obj.isModerator) {
//         await Product.findByIdAndUpdate(id, { $set: body }, { new: true }).then((res) => {
//             if (res) {
//                 response.status(200).json({ message: "Product Update Successfully" });
//             } else {
//                 response.status(400).json({ message: "Error in Update Product" })
//             }
//         }).catch(err => {
//             console.log(err);
//             response.status(400).json({ message: "This is Not Moderator" });
//         })
//     }
// })


// Miqdorini o'zgartirish


router.patch('/updateStatus/:id/:token', async function(request, response) {
    var id = request.params.id;
    var token = request.params.token;
    var admin = await Admin.find();
    var obj = Admin.verifyOfAdmin(admin, token);
    let body = {};
    if (obj.isModerator) {
        body.status = "Success";
        Orders.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
            if (res) {
                response.status(200).json({ message: "Status: Success" })
            } else {
                response.status(400).json({ message: "Error in status" })
            }
        }).catch(err => {
            console.log(err);
            response.status(400).json(err);
        })
}
else {
    response.status(400).json({message: "It's not Moderator"});
}
})


router.post('/search', async(request, response) => {
    var body = request.body;
    console.log("Body ");
    console.log(body);

    var thisname = body.name;
    console.log(thisname)

    await Orders.find({ "name": thisname }).then(all => {
        response.status(200).json(all);
    }).catch(err => {
        response.status(400).json({ message: "Error in search Phram" })
    })
})
 
module.exports = router;
