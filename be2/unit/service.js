/**
 *
 * Unit database services
 */

const Unit = require('./model').Unit;
function validationUnit(){

}

const Floor = require("./../floor/model").Floor;

module.exports = {
    listUnit: async function (query, page = 1, limit = 1000) {
        try{
            const skip = (page - 1) * limit;
            let unit;
            if(Object.keys(query).length === 0) {
                unit = await Unit.find({}).skip(skip).limit(limit).populate([{
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        }
                    }
                }, {
                    path: "unttp",
                    model: "UnitType",
                    select: "-__v",
                },
                {
                    path: "untrt",
                    model: "UnitRate",
                    select: "-__v",
                }]).select('-__v').sort({$natural:-1});
            }else{
                unit = await Unit.find().or([
                    { 'cdunt': { $regex: `${query.cdunt}` }}
                ])
                .skip(skip)
                .limit(limit)
                .populate([{
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        }
                    }
                }, {
                    path: "unttp",
                    model: "UnitType",
                    select: "-__v",
                },
                {
                    path: "untrt",
                    model: "UnitRate",
                    select: "-__v",
                }]).select('-__v')
                .sort({$natural:-1});
            }

            if(unit){
                return unit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    //list Unit Mobile
    listUnitMobile: async function (query, page = 1, limit = 1000) {
        try{
            const skip = (page - 1) * limit;
            unit = await Unit.find({}).skip(skip).limit(limit).populate([{
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        }
                    }
                }, {
                    path: "unttp",
                    model: "UnitType",
                    select: "-__v",
                },
                {
                    path: "untrt",
                    model: "UnitRate",
                    select: "-__v",
                }]).select('-__v').sort({$natural:-1});
            // }else{
            //     unit = await Unit.find().or([
            //         { 'cdunt': { $regex: `${query.cdunt}` }}
            //     ])
            //     .skip(skip)
            //     .limit(limit)
            //     .populate([{
            //         path: "flr",
            //         model: "Floor",
            //         select: "-__v",
            //         populate: {
            //             path: "blk",
            //             model: "Block",
            //             select: "-__v",
            //             populate: {
            //                 path: "grpid",
            //                 model: "BlockGroup",
            //                 select: "-__v",
            //             }
            //         }
            //     }, {
            //         path: "unttp",
            //         model: "UnitType",
            //         select: "-__v",
            //     },
            //     {
            //         path: "untrt",
            //         model: "UnitRate",
            //         select: "-__v",
            //     }]).select('-__v')
            //     .sort({$natural:-1});
            // }

            if(unit){
                return unit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    getUnitByParent: async function(id){
        try{
            const unit = await Unit.find({flr: id}).populate({
                path: "flr",
                model: "Floor",
                select: "-__v",
                populate: {
                    path: "blk",
                    model: "Block",
                    select: "-__v",
                    populate: {
                        path: "grpid",
                        model: "BlockGroup",
                        select: "-__v",
                    }
                }
            }).select('-__v');
            if(unit){
                return unit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

//get unit by parent mobile
getUnitByParentMobile: async function(id){
    try{
        const unit = await Unit.find({flr: id}).populate({
            path: "flr",
            model: "Floor",
            select: "-__v",
            populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                    path: "grpid",
                    model: "BlockGroup",
                    select: "-__v",
                }
            }
        }).select('-__v');
        if(unit){
            return unit;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},

    listUnitById: async function(id){
        try {
            const unit = await Unit.findById(id).populate({
                path: "flr",
                model: "Floor",
                select: "-__v",
                populate: {
                    path: "blk",
                    model: "Block",
                    select: "-__v",
                    populate: {
                        path: "grpid",
                        model: "BlockGroup",
                        select: "-__v",
                    }
                }
            }).select('-__v');;
            if(unit){
                return unit;
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }
    },

//list unit by ID mobile
listUnitByIdMobile: async function(id){
    try {
        const unit = await Unit.findById(id).populate({
            path: "flr",
            model: "Floor",
            select: "-__v",
            populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                    path: "grpid",
                    model: "BlockGroup",
                    select: "-__v",
                }
            }
        }).select('-__v');;
        if(unit){
            return unit;
        }else{
            return false
        }
    }catch (e) {
        console.log(e);
    }
},

    addUnit: async function(unit){
        try {
            const newUnit = await new Unit(unit).save();
            if(newUnit){
                return newUnit;
            }else{
                returnfalse;
            }
        }catch (e) {
            console.log(e);
        }
    },

// add unit mobile
addUnitMobile: async function(unit){
    try {
        const newUnit = await new Unit(unit).save();
        if(newUnit){
            return newUnit;
        }else{
            returnfalse;
        }
    }catch (e) {
        console.log(e);
    }
},

    updateUnit: async function(id, unit){
        try {
            const updateUnit = await Unit.findByIdAndUpdate(id, unit);
            if(updateUnit){
                return updateUnit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

//update unit mobile
updateUnitMobile: async function(id, unit){
    try {
        const updateUnit = await Unit.findByIdAndUpdate(id, unit);
        if(updateUnit){
            return updateUnit;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},

//delete unit mobile
deleteUnitMobile: async function(id){
    try {
        const deleteUnit = await Unit.findByIdAndRemove(id);
        if(deleteUnit){
            return deleteUnit;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},

    deleteUnit: async function(id){
        try {
            const deleteUnit = await Unit.findByIdAndRemove(id);
            if(deleteUnit){
                return deleteUnit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}