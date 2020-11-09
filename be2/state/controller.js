const fs = require('fs');
const {listProvince, listDistrict, listRegency, listVillage, listKodePos} = require('./service');
const Province = require("./modelProvince").Province;
const District = require("./modelDistrict").District;
const KodePos = require("./modelPostalCode").KodePos;
const Regency = require("./modelRegency").Regency;
const Village = require("./modelVillage").Village;
const errorHandler = require('../controllers/errorController');

module.exports = {
    createState: async (req, res, next) => {
        try{
            const provinces = JSON.parse(
                fs.readFileSync(`${__dirname}/province.json`, "utf-8")
            );
            const districts = JSON.parse(
                fs.readFileSync(`${__dirname}/districts.json`, "utf-8")
            );
            const kodeposs = JSON.parse(
                fs.readFileSync(`${__dirname}/zipcode.json`, "utf-8")
            );
            const regencys = JSON.parse(
                fs.readFileSync(`${__dirname}/regencies.json`, "utf-8")
            );
            const villages = JSON.parse(
                fs.readFileSync(`${__dirname}/villages.json`, "utf-8")
            );

            const provinsi = await Province.create(provinces);
            const distrik = await District.create(districts);
            const zipcode = await KodePos.create(kodeposs);
            const regen = await Regency.create(regencys);
            const desa = await Village.create(villages);
            if (provinsi && distrik && zipcode && regen && desa) {
                res.status(200).json({
                    status: 'success'
                });
            }
        }catch(err){
            console.error(err);
            return errorHandler(err);
        }
    },
    getProvince : async function (req, res, next) {
        try {
            const province = await listProvince(req.body.filter, req.body.page, req.body.limit);
            if(province){
                return res.status(200).json({"status" : "success", "data": province});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getRegency : async function(req, res, next){
        try {
            const regency = await listRegency(req.body.filter, req.body.page, req.body.limit);
            if(regency){
                return res.status(200).json({"status" : "success", "data": regency});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"})
            }
        }catch (e) {
            console.log(e);
        }
    },
    getDistrict : async function(req, res, next){
        try {
            const district = await listDistrict(req.body.filter, req.body.page, req.body.limit);
            if(district){
                return res.status(200).json({"status": "success", "data": district});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getVillage : async function(req, res, next){
        try {
            const village = await listVillage(req.body.filter,  req.body.page, req.body.limit);
            if(village){
                return res.status(200).json({"status": "success", "data": village});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getRegencyByParent : async function(req, res, next){
        try {
            const regency = await listRegency({province_code: req.params.id}, req.body.page, req.body.limit);
            if(regency){
                return res.status(200).json({"status": "success", "data": regency});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getDistrictByParent : async function(req, res, next){
        try {
            const district = await listDistrict({regency_code: req.params.id}, req.body.page, req.body.limit);
            if(district){
                return res.status(200).json({"status": "success", "data": district});
            }else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getVillageByParent : async function(req, res, next){
        try {
            const village = await listVillage({district_code: req.params.id}, req.body.page, req.body.limit);
            if(village){
                return res.status(200).json({"status": "success", "data": village});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getKodePosByParent : async function(req, res, next){
        try {
            const kodePos = await listKodePos({kecamatan: req.params.kecamatan.toUpperCase()}, req.body.page, req.body.limit);
            if(kodePos){
                return res.status(200).json({"status": "success", "data": kodePos});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
};