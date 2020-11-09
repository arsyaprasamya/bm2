const excel = require("exceljs");
const multer = require("multer");
const dateFormat = require("dateformat");
const errorHandler = require('../controllers/errorController');
const {addOwnership, getOwnership, listOwnership, editOwnership} = require("../contract/owner/service");
const {addTenant, getTenant, listTenant, editTenant} = require("../contract/tenant/service");
const {findAllGroup, findByGroupId, addBlockGroup, updateBlockGroup} = require("../blockgroup/service");
const {listBlock, addBlock, updateBlock, findBlockById} = require("../block/service");
const {listFloor, findFloorById, addFloor, updateFloor} = require("../floor/service");
const {listUnit, listUnitById, updateUnit, addUnit} = require("../unit/service");
const {listUnitType, lstUnitTypeById, editUnitType, addUnitType} = require("../unittype/service");
const {listUnitRate, getUnitRateById, addUnitRate, updateUnitRate} = require("../unitrate/service");
const {listCustomer, findByCustomerId, editCustomer, addCustomer} = require("../customer/service");
const {listEngineer, lstEngineerById,} = require("../masterData/engineer/service");


const {listCategory} = require("../masterData/helpdesk/category/service");
const {listDefect} = require("../masterData/helpdesk/defect/service");



const {listVillage} = require("../state/service");
const {listParkingLot} = require("../parkinglot/service");
const {listBilling, addBilling } = require("../billing/service");
const {listRentalBilling} = require("../rentalBilling/service");
const {listLeaseBilling } = require("../leaseBilling/service");
const {listParkBilling } = require("../parkBilling/service");
const {listPower, updatePower, addPower} = require("../power/master/service");
const {listWater, addWater} = require("../water/master/service");
const {listRateWater} = require("../water/rate/service");
const {listRatePower} = require("../power/rate/service");
const {listRateGas} = require("../gas/rate/service");
const {findAllDeposit} = require("../deposit/service");
const {getAll} = require("../rentalBilling/controller")
const {listGas } = require("../gas/master/service");
const servicesElectCons = require('../power/transaksi/service');
const servicePowerMst = require('../power/master/service');
const servicesWaterCons = require('../water/transaksi/service');
const serviceWaterMst = require('../water/master/service');
const servicesGasCons = require('../gas/transaksi/service');
const serviceGasMst = require('../gas/master/service');
const fs = require("fs");

module.exports = {
    downloadFormatProject: async function (req, res, next) {
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('project');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden:true},
            {header: 'Project Name', key: 'grpnm'},
        ];
        const group = await findAllGroup({}, 1, 1000000);
        group.forEach(e => {
            const row = {id: e._id, grpnm: e.grpnm}
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "project.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatBlock: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('block');
        var worksheetproject = workbook.addWorksheet('project');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Block Code', key: 'cdblk'},
            {header: 'Block Name', key: 'nmblk'},
            {header: 'Block Address', key: 'addrblk'},
            {header: 'Block Phone', key: 'phnblk'},
            {header: 'RT', key: 'rt'},
            {header: 'RW', key: 'rw'},
            {header: 'Slot Avaliable', key : 'spa'},
            {header: 'Total  Space', key : 'total'},
            {header: 'Sinking Fund Period', key : 'sf'},
            {header: 'Project Name', key: 'grpid'},
           
        ];
        const block = await listBlock({}, 1, 1000000);
      //  const blockgrp = block;
        block.forEach(e => {
            const row = {
            id: e._id,
            cdblk: e.cdblk, 
            nmblk: e.nmblk, 
            addrblk: e.addrblk, 
            phnblk: e.phnblk,
            rt: e.rt,
            rw: e.rw,
            spa: e.availspace,
            total : e.space,
            sf : e.month,
            grpid: e['grpid'].grpnm};
            worksheet.addRow(row);
        });
        worksheetproject.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Project Name', key: 'grpnm'},
        ];
        const project = await findAllGroup({}, 1, 1000000);
        project.forEach(e => {
            const rowp = {id: e._id, grpnm: e.grpnm}
            worksheetproject.addRow(rowp);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "block.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatFloor: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('floor');
        var worksheetproject = workbook.addWorksheet('block');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Floor Code', key: 'cdflr'},
            {header: 'Floor Name', key: 'nmflr'},
            {header: 'Block Code', key: 'blk'},
            {header: 'Block Name', key: 'nmblk'},
                     
        ];
        const floor = await listFloor({}, 1, 1000000);
        floor.forEach(e => {
            const row = {
            id: e._id,
            cdflr: e.cdflr, 
            nmflr: e.nmflr, 
            blk: e['blk'].cdblk,
            nmblk: e.blk.nmblk};
            worksheet.addRow(row);
        });
        worksheetproject.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Block Code', key: 'cdblk'},
        ];
        const block = await listBlock({}, 1, 1000000);
        block.forEach(e => {
            const rowp = {id: e._id, cdblk: e.cdblk}
            worksheetproject.addRow(rowp);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "floor.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatUnit: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('unit');
        var worksheetunittype = workbook.addWorksheet('unittype');
        var worksheetunitrate = workbook.addWorksheet('unitrate');
        var worksheetflr = workbook.addWorksheet('floor');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Code', key: 'cdunt'},
            {header: 'Floor Id', key: 'flr'},
            {header: 'Unit Name', key: 'nmunt'},
            {header: 'Unit Number', key: 'untnum'},
            {header: 'Unit Type', key: 'unttp'},
            {header: 'Unit Size', key: 'untsqr'},
            {header: 'Unit Rate', key: 'untrt'},
            {header: 'Service Charge', key: 'srvcrate'},
            {header: 'Overstay Rate', key: 'ovstyrate'},
            {header: 'Sinking Fund', key: 'sinkingfund'},
            {header: 'Price', key: 'price'},
            {header: 'Rental Price', key: 'rentalPrice'},

        ];
        const unit = await listUnit({}, 1, 1000000);

        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                cdunt: e.cdunt,
                flr: e.flr.cdflr,
                nmunt: e.nmunt,
                untnum: e.untnum,
                unttp: e.unttp.unttp,
                untsqr: e.untsqr,
                untrt : e.untrt.unit_rate_name,
                rate: e.rate,
                srvcrate: e.srvcrate,
                ovstyrate: e.ovstyrate,
                sinkingfund: e.sinkingfund,
                price : e.price,
                rentalPrice : e.rentalPrice,
            };
            worksheet.addRow(row);
        });
        
        worksheetunittype.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Type', key: 'unttp'},
        ];
        const unittype = await listUnitType({}, 1, 1000000);
        unittype.forEach(e => {
            const rowp = {id: e._id, unttp: e.unttp}
            worksheetunittype.addRow(rowp);
        });

        worksheetunitrate.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Rate', key: 'unit_rate_name'},
        ];
        const unitrate = await listUnitRate({}, 1, 1000000);
        unitrate.forEach(e => {
            const rowpp = {id: e._id, unit_rate_name: e.unit_rate_name}
            worksheetunitrate.addRow(rowpp);
        });

        worksheetflr.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Floor', key: 'cdflr'},
        ];
        const flr = await listFloor({}, 1, 1000000);
        flr.forEach(e => {
            const rowpp = {id: e._id, cdflr: e.cdflr}
            worksheetflr.addRow(rowpp);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "unit.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },


    downloadFormatUnitType: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('unittype');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Type', key: 'unttp'},
            {header: 'Unit Size ( m2 )', key: 'untsqr'}

        ];
        const unittype = await listUnitType({}, 1, 1000000);

        unittype.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                unttp: e.unttp,
                untsqr: e.untsqr
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "unittype.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatCustomer: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('tenant');
        var worksheetvillage = workbook.addWorksheet('village');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Tenant Code', key: 'cstrmrcd'},
            {header: 'Tenant Nik', key: 'cstrmrpid'},
            {header: 'Tenant Name', key: 'cstrmrnm'},
            {header: 'Tax Account', key: 'npwp'},
            {header: 'Tenant Address', key: 'addrcstmr'},
            {header: 'Tenant Phone', key: 'phncstmr'},
            {header: 'Tenant Email', key: 'emailcstmr'},
            {header: 'Tenant Gender', key: 'gndcstmr'},
            {header: 'Village', key: 'idvllg'},
            {header: 'Zipcode', key: 'postcode'},
            {header: 'Tenant Type', key: 'type'},
            {header: 'Bank Name', key: 'bankname'},
            {header: 'Bank Account', key: 'bankaccnt'},

        ];
        const unit = await listCustomer({}, 1, 1000000);
        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                cstrmrcd: e.cstrmrcd,
                cstrmrpid: e.cstrmrpid,
                cstrmrnm: e.cstrmrnm,
                npwp: e.npwp,
                addrcstmr: e.addrcstmr,
                phncstmr: e.phncstmr,
                emailcstmr: e.emailcstmr,
                gndcstmr: e.gndcstmr,
                idvllg:  e['idvllg'].name,
                postcode: e.postcode,
                type: e.type,
                bankname: e.bankname,
                bankaccnt: e.bankaccnt,

            };
           console.log(row);
            worksheet.addRow(row);
        });

        worksheetvillage.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Village', key: 'name'},
        ];
        const village = await listVillage({}, 1, 1000000);
        village.forEach(e => {
            const rowp = {id: e._id, name: e.name, }
            worksheetvillage.addRow(rowp);
        });
        
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "tenant.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatBilling: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('billing');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Billing Number', key: 'billing_number'},
            {header: 'Unit', key: 'unit'},
            {header: 'Billed To', key: 'billed_to'},
            {header: 'Created Date', key: 'created_date'},
            {header: 'Billing Date', key: 'billing_date'},
            {header: 'Due Date', key: 'due_date'}

        ];
        const unit = await listBilling({}, 1, 1000000);
        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                billing_number: e.billing_number,
                unit: e.unit2,
                billed_to: e.billed_to,
                created_date: e.created_date,
                billing_date: e.billing_date,
                due_date: e.due_date,
                
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "billing.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatLeaseBilling: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('leasebilling');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Billing Number', key: 'billingNo'},
            {header: 'Unit', key: 'unit'},
            {header: 'Lease Fee', key: 'fee'},
            {header: 'Billed To', key: 'billedTo'},
            {header: 'Created Date', key: 'createdDate'},
            {header: 'Billing Date', key: 'billingDate'},
            {header: 'Due Date', key: 'dueDate'}

        ];
        const unit = await listLeaseBilling({}, 1, 1000000);
        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                billingNo: e.billingNo,
                unit: e.lease.unit.cdunt,
                fee: e.lease.unit.rentalPrice,
                billedTo: e.lease.contact_name,
                createdDate: e.createdDate,
                billingDate: e.billingDate,
                dueDate: e.dueDate,
                
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "billing.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatRental: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('rentalbilling');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Billing Number', key: 'billingNo'},
            {header: 'Unit', key: 'unit'},
            {header: 'Rental Fee', key: 'fee'},
            {header: 'Billed To', key: 'billedTo'},
            {header: 'Created Date', key: 'createdDate'},
            {header: 'Billing Date', key: 'billingDate'},
            {header: 'Due Date', key: 'dueDate'}

        ];
        const unit = await listRentalBilling({}, 1, 1000000);
        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                billingNo: e.billingNo,
                unit: e.lease.unit.cdunt,
                fee: e.lease.unit.rentalPrice,
                billedTo: e.lease.contact_name,
                createdDate: e.createdDate,
                billingDate: e.billingDate,
                dueDate: e.dueDate,
                
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "billing.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatParkingBilling: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('Parking Billing');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Billing No', key: 'billingNo'},
            {header: 'Unit', key: 'unit'},
            {header: 'Parking Fee', key: 'fee'},
            {header: 'Billed To', key: 'billedTo'},
            {header: 'Created Date', key: 'createdDate'},
            {header: 'Billing Date', key: 'billingDate'},
            {header: 'Due Date', key: 'dueDate'}

        ];
        const unit = await listParkBilling({}, 1, 1000000);
        unit.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                billingNo: e.billingNo,
                unit: e.parking.unitcustomer,
                fee: e.parking.parkingRate,
                billedTo: e.parking.customer,
                createdDate: e.createdDate,
                billingDate: e.billingDate,
                dueDate: e.dueDate,
                
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "billing.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatEngineer: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('engineer');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'NIP', key: 'engnrid'},
            {header: 'Engineer Name', key: 'name'},
            {header: 'Status', key: 'status'},
            {header: 'Phone No.', key: 'phone'},
            {header: 'Email', key: 'email'}
        ];
        const engineer = await listEngineer({}, 1, 1000000);

        engineer.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                engnrid: e.engnrid,
                name: e.name,
                status: e.status,
                phone: e.phone,
                email: e.email,
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "engineer.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },


    downloadFormatLocation: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('location');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Location ID', key: 'categoryid'},
            {header: 'Location Name', key: 'name'},
 
        ];
        const engineer = await listCategory({}, 1, 1000000);

        engineer.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                categoryid: e.categoryid,
                name: e.name,
            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "location.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    











    downloadFormatParkinglot: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('parkinglot');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Parking Lot Name', key: 'nmplot'},
            {header: 'Parking Lot Block', key: 'plotblk'},
            {header: 'Parking Lot Number', key: 'plotnum'},
        ];
        const block = await listParkingLot({}, 1, 1000000);
        block.forEach(e => {
            //.replace(/^"+/i, '')
            console.log(e);
            const row = {id: e._id, nmplot: e.nmplot, plotblk: e.plotblk, plotnum: e.plotnum};
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Parkinglot.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatUnitRate: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('unitrate');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Rate Name', key: 'unit_rate_name'},
            {header: 'Service Rate', key: 'service_rate'},
            {header: 'Sinking Fund', key: 'sinking_fund'},
            {header: 'Overstay Rate', key: 'overstay_rate'},
            {header: 'Rental Rate', key: 'rental_rate'},
            
        ];
        const block = await listUnitRate({}, 1, 1000000);
        block.forEach(e => {
            //.replace(/^"+/i, '')
            console.log(e);
            const row = {
                id: e._id, 
                unit_rate_name: e.unit_rate_name, 
                service_rate: e.service_rate, 
                sinking_fund: e.sinking_fund, 
                overstay_rate: e.overstay_rate,
                rental_rate : e.rentPrice}
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Unitrate.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatOwner: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('owner');
        var worksheetcustomer = workbook.addWorksheet('tenant');
        var worksheetunit = workbook.addWorksheet('unit');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Tenant Name', key: 'cstmr'},
            {header: 'Contract Number', key: 'contract_number'},
            {header: 'Contract Date', key: 'contract_date'},
            {header: 'Expiry Date', key: 'expiry_date'},
            {header: 'Contact Name', key: 'contact_name'},
            {header: 'Contract Address', key: 'contact_address'},
            {header: 'Contact Phone', key: 'contact_phone'},
            {header: 'Contact City', key: 'contact_city'},
            {header: 'Contact Zip', key: 'contact_zip'},
            {header: 'Unit', key: 'unit'},
            {header: 'Payment Type', key: 'paymentType'},
            {header: 'Payment Term', key: 'paymentTerm'},
            {header: 'Start Electricity Stand', key: 'start_electricity_stand'},
            {header: 'Start Water Stand', key: 'start_water_stand'},
            {header: 'Virtual Account', key: 'virtualAccount'},
            {header: 'Tax Id', key: 'tax_id'},

        ];
        const owner = await listOwnership({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                cstmr: e['cstmr'].cstrmrnm,
                contract_number: e.contract_number, 
                contract_date: e.contract_date, 
                expiry_date: e.expiry_date, 
                contact_name: e.contact_name, 
                contact_address: e.contact_address, 
                contact_phone: e.contact_phone, 
                contact_city: e.contact_city, 
                contact_zip:  e.contact_zip, 
                unit: e['unit'].nmunt,
                paymentType: e.paymentType, 
                paymentTerm: e.paymentTerm, 
                start_electricity_stand: e.start_electricity_stand, 
                start_water_stand: e.start_water_stand, 
                virtualAccount: e.virtualAccount, 
                tax_id: e.tax_id, 

            };
            worksheet.addRow(row);
        });

        worksheetcustomer.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Tenant Name', key: 'cstrmrnm'},
        ];
        const cust = await listCustomer({}, 1, 1000000);
        cust.forEach(e => {
            const rowp = {id: e._id, cstrmrnm: e.cstrmrnm, }
            worksheetcustomer.addRow(rowp);
        });

        worksheetunit.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Name', key: 'nmunt'},
        ];
        const unt = await listUnit({}, 1, 1000000);
        unt.forEach(e => {
            const rowpp = {id: e._id, nmunt: e.nmunt, }
            worksheetunit.addRow(rowpp);
            console.log(rowpp)
        });
        
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Tenant.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    
    downloadFormatLease: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('lease');
        var worksheetcustomer = workbook.addWorksheet('tenant');
        var worksheetunit = workbook.addWorksheet('unit');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Tenant Name', key: 'cstmr'},
            {header: 'Contract Number', key: 'contract_number'},
            {header: 'Contract Date', key: 'contract_date'},
            {header: 'Expiry Date', key: 'expiry_date'},
            {header: 'Contact Name', key: 'contact_name'},
            {header: 'Contract Address', key: 'contact_address'},
            {header: 'Contact Phone', key: 'contact_phone'},
            {header: 'Contact City', key: 'contact_city'},
            {header: 'Contact Zip', key: 'contact_zip'},
            {header: 'Unit', key: 'unit'},
            {header: 'Payment Type', key: 'paymentType'},
            {header: 'Payment Term', key: 'paymentTerm'},
            {header: 'Start Electricity Stand', key: 'start_electricity_stand'},
            {header: 'Start Water Stand', key: 'start_water_stand'},
            {header: 'Virtual Account', key: 'virtualAccount'},
            {header: 'Tax Id', key: 'tax_id'},
        ];
        const owner = await listTenant({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                cstmr: e['cstmr'].cstrmrnm,
                contract_number: e.contract_number, 
                contract_date: e.contract_date, 
                expiry_date: e.expiry_date, 
                contact_name: e.contact_name, 
                contact_address: e.contact_address, 
                contact_phone: e.contact_phone, 
                contact_city: e.contact_city, 
                contact_zip:  e.contact_zip, 
                unit: e['unit'].nmunt,
                paymentType: e.paymentType, 
                paymentTerm: e.paymentTerm, 
                start_electricity_stand: e.start_electricity_stand, 
                start_water_stand: e.start_water_stand, 
                virtualAccount: e.virtualAccount, 
                tax_id: e.tax_id, 

            };
            worksheet.addRow(row);
        });

        worksheetcustomer.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Tenant Name', key: 'cstrmrnm'},
        ];
        const cust = await listCustomer({}, 1, 1000000);
        cust.forEach(e => {
            const rowp = {id: e._id, cstrmrnm: e.cstrmrnm, }
            worksheetcustomer.addRow(rowp);
        });

        worksheetunit.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Unit Name', key: 'nmunt'},
        ];
        const unt = await listUnit({}, 1, 1000000);
        unt.forEach(e => {
            const rowpp = {id: e._id, nmunt: e.nmunt, }
            worksheetunit.addRow(rowpp);
            console.log(rowpp)
        });
        
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Tenant.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

   


    downloadFormatDeposit: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('deposit');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Tenant Name', key: 'custname'},
            {header: 'Unit', key: 'unit'},
            {header: 'Description', key: 'desc'},
            {header: 'Description Out', key: 'descout'},
            {header: 'Invoice Date', key: 'invoicedte'},
            {header: 'Payment Type', key: 'pymnttype'},
            {header: 'Deposit In', key: 'dpstin'},
            {header: 'Deposit Out', key: 'dpstout'}

        ];
        const owner = await findAllDeposit({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                custname: e.custname,
                unit: e.contract.unit.cdunt,
                desc: e.desc, 
                descout: e.descout, 
                invoicedte: e.invoicedte, 
                pymnttype: e.pymnttype, 
                dpstin: e.dpstin, 
                dpstout: e.dpstout, 

            };
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Deposit.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },


    downloadFormatPowMaster: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('master power');
        var worksheetunit = workbook.addWorksheet('unit');
        var worksheetrate = workbook.addWorksheet('rate power');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, 
            {header: 'Nomor Meter', key: 'nmmtr'},
            {header: 'Unit', key: 'unt'},
            {header: 'Rate Name', key: 'rte'},
            {header: 'Rate Price ( Rp. )', key: 'rteprc'},
            
        ];
        const owner = await listPower({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                nmmtr: e.nmmtr,
                unt: e['unt'].cdunt,
                rte: e['rte'].nmrtepow,
                rteprc: e['rte'].rte
            };
           console.log(row);
            worksheet.addRow(row);
        });
           
        worksheetunit.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Code Unit', key: 'cdunt'},
        ];
        const unit = await listUnit({}, 1, 1000000);
        unit.forEach(e => {
            const rowp = {id: e._id, cdunt: e.cdunt, }
            worksheetunit.addRow(rowp);
        });
        
        worksheetrate.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Rate Name', key: 'nmrtepow'},
            {header: 'Rate', key: 'rte'},
        ];
        const ratepower = await listRatePower({}, 1, 1000000);
        ratepower.forEach(e => {
            const rowpp = {id: e._id, rte: e.rte, }
            worksheetrate.addRow(rowpp);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Power Master.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    
    downloadFormatWatMaster: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('master water');
        var worksheetunit = workbook.addWorksheet('unit');
        var worksheetrate = workbook.addWorksheet('rate water')
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Nomor Meter', key: 'nmmtr'},
            {header: 'Unit', key: 'unt'},
            {header: 'Rate Name', key: 'rte'},
            {header : 'Rate Price', key : 'rteprice'},
        ];
        const owner = await listWater({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                nmmtr: e.nmmtr,
                unt: e['unt'].cdunt,
                rte: e['rte'].nmrtewtr,
                rteprice: e.rte.rte,
            };
            worksheet.addRow(row);
        });
        worksheetunit.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Code Unit', key: 'cdunt'},
        ];
        const unit = await listUnit({}, 1, 1000000);
        unit.forEach(e => {
            const rowp = {id: e._id, cdunt: e.cdunt, }
            worksheetunit.addRow(rowp);
        });
        worksheetrate.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Rate', key: 'rte'},
        ];
        const ratewater = await listRateWater({}, 1, 1000000);
        ratewater.forEach(e => {
            const rowpp = {id: e._id, rte: e.rte, }
            worksheetrate.addRow(rowpp);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Water Master.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },

    downloadFormatGasMaster: async function(req, res, next){
        var workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet('master gas');
        var worksheetunit = workbook.addWorksheet('unit');
        var worksheetrate = workbook.addWorksheet('rate gas');
        worksheet.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Nomor Meter', key: 'nmmtr'},
            {header: 'Unit', key : 'unt'},
            {header: 'Rate Name', key: 'rte'},
            {header: 'Rate Price', key: 'rteprc'},
        ];
        const owner = await listGas({}, 1, 1000000);
        owner.forEach(e => {
            //.replace(/^"+/i, '')
            const row = {
                id: e._id,
                nmmtr: e.nmmtr,
                unt: e['unt'].cdunt,
                rte : e['rte'].nmrtegas,
                rteprc : e['rte'].rte,
            };
            worksheet.addRow(row);
        });

        worksheetunit.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Code Unit', key: 'cdunt'},
        ];
        const unit = await listUnit({}, 1, 1000000);
        unit.forEach(e => {
            const rowp = {id: e._id, cdunt: e.cdunt,}
            worksheetunit.addRow(rowp);
        });    

        worksheetrate.columns = [
            {header: 'uniqueid', key: 'id', hidden: true},
            {header: 'Rate', key: 'rte'},
        ];
        const rategas = await listRateGas({}, 1, 1000000);
        rategas.forEach(e => {
            const rowpp = {id: e._id, rte: e.rte, }
            worksheetrate.addRow(rowpp);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "GasMaster.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },



    downloadFormatPowerConsumption: async (req, res, next)=>{
        let workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        let worksheet = workbook.addWorksheet('Electricity Consumption');
        worksheet.columns = [
            // {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Electricity Meter No', key: 'pow_nmmtr'},
            {header: 'Electricity Rate Name', key: 'pow_rte_nmrtepow'},
            {header: 'Code Unit', key: 'pow_unt_cdunt'},
            {header: 'Starting Meter Position', key: 'strtpos'},
            {header: 'Last Meter Position', key: 'endpos'},
            {header: 'Billing Date', key: 'billmnt'},
            {header: 'Billing Amount', key: 'billamnt'},
            {header: 'Loss', key: 'loss'}

        ];
        const owner = await servicesElectCons.listTransaksi({}, 1, 1000000);
        owner.forEach(e => {
            const row = {
                // id: e._id,
                pow_nmmtr: e.pow.nmmtr,
                pow_rte_nmrtepow: e.pow.rte.nmrtepow, 
                pow_unt_cdunt: e.pow.unt.cdunt, 
                strtpos: e.strtpos, 
                endpos: e.endpos, 
                billmnt: dateFormat(e.billmnt, "dd/mm/yyyy"), 
                billamnt: e.billamnt, 
                loss: e.loss
            };
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "electricity_consumption.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatWaterConsumption: async (req, res, next)=>{
        let workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        let worksheet = workbook.addWorksheet('Water Consumption');
        worksheet.columns = [
            // {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Water Meter No', key: 'wat_nmmtr'},
            {header: 'Water Rate Name', key: 'wat_rte_nmrtewtr'},
            {header: 'Code Unit', key: 'wat_unt_cdunt'},
            {header: 'Starting Meter Position', key: 'strtpos'},
            {header: 'Last Meter Position', key: 'endpos'},
            {header: 'Billing Date', key: 'billmnt'},
            {header: 'Billing Amount', key: 'billamnt'},
            {header: 'Air Kotor', key: 'loss'}

        ];
        const owner = await servicesWaterCons.listTransaksi({}, 1, 1000000);
        owner.forEach(e => {
            const row = {
                // id: e._id,
                wat_nmmtr: e.wat.nmmtr,
                wat_rte_nmrtewtr: e.wat.rte.nmrtewtr, 
                wat_unt_cdunt: e.wat.unt.cdunt, 
                strtpos: e.strtpos, 
                endpos: e.endpos, 
                billmnt: dateFormat(e.billmnt, "dd/mm/yyyy"), 
                billamnt: e.billamnt, 
                loss: e.loss
            };
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "water_consumption.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    downloadFormatGasConsumption: async (req, res, next)=>{
        let workbook = new excel.Workbook();
        workbook.created = new Date();
        workbook.modified = new Date();
        let worksheet = workbook.addWorksheet('Gas Consumption');
        worksheet.columns = [
            // {header: 'uniqueid', key: 'id', hidden: true}, // 1
            {header: 'Gas Meter No', key: 'gas_nmmtr'},
            {header: 'Gas Rate Name', key: 'gas_rte_nmrtegas'},
            {header: 'Code Unit', key: 'gas_unt_cdunt'},
            {header: 'Starting Meter Position', key: 'strtpos'},
            {header: 'Last Meter Position', key: 'endpos'},
            {header: 'Billing Date', key: 'billmnt'},
            {header: 'Billing Amount', key: 'billamnt'}

        ];
        const owner = await servicesGasCons.listTransaksi({}, 1, 1000000);
        owner.forEach(e => {
            const row = {
                // id: e._id,
                gas_nmmtr: e.gas.nmmtr,
                gas_rte_nmrtegas: e.gas.rte.nmrtegas, 
                gas_unt_cdunt: e.gas.unt.cdunt, 
                strtpos: e.strtpos, 
                endpos: e.endpos, 
                billmnt: dateFormat(e.billmnt, "dd/mm/yyyy"), 
                billamnt: e.billamnt
            };
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "gas_consumption.xlsx");
        return workbook.xlsx.write(res)
            .then(function() {
                res.status(200).end();
            });
    },
    uploadElectricityConsExcel: async (req, res, next)=>{
        try{
            const file = req.file;
            if (file) {
                const workbook = new excel.Workbook();
                workbook.xlsx.readFile(`${file.path}`).then((result) => {
                    workbook.eachSheet((sheet, sheetId)=>{
                        if (sheet.name.toLowerCase() === "electricity" || sheet.name.toLowerCase() === "electricity consumption") {
                            const worksheet = workbook.getWorksheet(sheet.name);
                            let validated = false;
                            worksheet.eachRow((row, rowNumber)=>{
                                if (rowNumber === 1) {
                                    row.values[1].toLowerCase() === "electricity meter no"?validated=true:validated=false;
                                } else {
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            servicePowerMst.listPower({nmmtr: row.values[1]}, 1, 100000).then((result) => {
                                                darr = row.values[6].split("/");
                                                let dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
                                                const dataPowerConst = {
                                                    isPaid: false,
                                                    checker: false,
                                                    pow: result[0].id,
                                                    strtpos: row.values[4],
                                                    strtpos2: row.values[4]/10,
                                                    endpos: row.values[5],
                                                    endpos2: row.values[5]/10,
                                                    billmnt: dobj.toISOString(),
                                                    billamnt: row.values[7],
                                                    loss: row.values[8]
                                                }
                                                servicesElectCons.addTransaksi(dataPowerConst).then((result) => {
                                                    fs.unlink(`${file.path}`, ()=>{});
                                                    res.status(200).json({status: "success"});
                                                }).catch((err) => {
                                                    // console.error(err);
                                                    errorHandler(err);
                                                });
                                            }).catch((err) => {
                                                // console.error(err);
                                                errorHandler(err);
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    });
                }).catch((err) => {
                    // console.error(err);
                    errorHandler(err);
                });
            }else{
                const error = new Error('please upload your file');
                error.httpStatusCode = 400;
                return next(error)
            }
        }catch(error){
            // console.error(error);
            errorHandler(error);
        }
    },
    uploadWaterConsExcel: async (req, res, next)=>{
        try{
            const file = req.file;
            if (file) {
                const workbook = new excel.Workbook();
                workbook.xlsx.readFile(`${file.path}`).then((result) => {
                    workbook.eachSheet((sheet, sheetId)=>{
                        if (sheet.name.toLowerCase() === "water" || sheet.name.toLowerCase() === "water consumption") {
                            const worksheet = workbook.getWorksheet(sheet.name);
                            let validated = false;
                            worksheet.eachRow((row, rowNumber)=>{
                                if (rowNumber === 1) {
                                    row.values[1].toLowerCase() === "water meter no"?validated=true:validated=false;
                                } else {
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            serviceWaterMst.listWater({nmmtr: row.values[1]}, 1, 100000).then((result) => {
                                                darr = row.values[6].split("/");
                                                let dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
                                                const dataWaterConst = {
                                                    isPaid: false,
                                                    checker: false,
                                                    wat: result[0].id,
                                                    strtpos: row.values[4],
                                                    strtpos2: row.values[4]/100,
                                                    endpos: row.values[5],
                                                    endpos2: row.values[5]/100,
                                                    billmnt: dobj.toISOString(),
                                                    billamnt: row.values[7],
                                                    air_kotor: row.values[8]
                                                }
                                                servicesWaterCons.addTransaksi(dataWaterConst).then((result) => {
                                                    fs.unlink(`${file.path}`, ()=>{});
                                                    res.status(200).json({status: "success"});
                                                }).catch((err) => {
                                                    // console.error(err);
                                                    errorHandler(err);
                                                });
                                            }).catch((err) => {
                                                // console.error(err);
                                                errorHandler(err);
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    });
                }).catch((err) => {
                    // console.error(err);
                    errorHandler(err);
                });
            }else{
                const error = new Error('please upload your file');
                error.httpStatusCode = 400;
                return next(error)
            }
        }catch(error){
            // console.error(error);
            errorHandler(error);
        }
    },
    uploadGasConsExcel: async (req, res, next)=>{
        try{
            const file = req.file;
            if (file) {
                const workbook = new excel.Workbook();
                workbook.xlsx.readFile(`${file.path}`).then((result) => {
                    workbook.eachSheet((sheet, sheetId)=>{
                        if (sheet.name.toLowerCase() === "gas" || sheet.name.toLowerCase() === "gas consumption") {
                            const worksheet = workbook.getWorksheet(sheet.name);
                            let validated = false;
                            worksheet.eachRow((row, rowNumber)=>{
                                if (rowNumber === 1) {
                                    row.values[1].toLowerCase() === "gas meter no"?validated=true:validated=false;
                                } else {
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            serviceGasMst.listGas({nmmtr: row.values[1]}, 1, 100000).then((result) => {
                                                darr = row.values[6].split("/");
                                                let dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
                                                const dataGasConst = {
                                                    gas: result[0].id,
                                                    strtpos: row.values[4],
                                                    endpos: row.values[5],
                                                    billmnt: dobj.toISOString(),
                                                    billamnt: row.values[7]
                                                }
                                                servicesGasCons.addTransaksi(dataGasConst).then((result) => {
                                                    fs.unlink(`${file.path}`, ()=>{});
                                                    res.status(200).json({status: "success"});
                                                }).catch((err) => {
                                                    // console.error(err);
                                                    errorHandler(err);
                                                });
                                            }).catch((err) => {
                                                // console.error(err);
                                                errorHandler(err);
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    });
                }).catch((err) => {
                    // console.error(err);
                    errorHandler(err);
                });
            }else{
                const error = new Error('please upload your file');
                error.httpStatusCode = 400;
                return next(error)
            }
        }catch(error){
            // console.error(error);
            errorHandler(error);
        }
    },
    uploadProjectExcel: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "project"){
                            var worksheet = workbook.getWorksheet('project');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                console.log(row.values);
                                if(rowNumber == 1){
                                    if(row.values[2] == "Project Name"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await findByGroupId(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.grpnm){

                                                }else{
                                                    var updateBlock = await updateBlockGroup(row.values[1].replace(/"+/ig, ''), {grpnm: row.values[2]});
                                                }
                                            }
                                        } else {
                                            var newBlock = await addBlockGroup({grpnm: row.values[2]});
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadUnitTypeExcel: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "unittype"){
                            var worksheet = workbook.getWorksheet('unittype');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                console.log(row.values);
                                if(rowNumber == 1){
                                    if(row.values[2] == "Unit Type"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await lstUnitTypeById(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.unttp,
                                                    row.values[3] == check.untsqr){

                                                }else{
                                                    var updateUnitType = await editUnitType(row.values[1].replace(/"+/ig, ''), {
                                                    unttp: row.values[2],
                                                    untsqr: row.values[3],
                                                   
                                                
                                                });
                                                }
                                            }
                                        } else {
                                            var newUnittype = await addUnitType({
                                                    unttp: row.values[2],
                                                    untsqr: row.values[3],
                                                    
                                                                                                
                                                });
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadUnitRateExcel: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "unitrate"){
                            var worksheet = workbook.getWorksheet('unitrate');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                console.log(row.values);
                                if(rowNumber == 1){
                                    if(row.values[2] == "Unit Rate Name"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await getUnitRateById(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.unit_rate_name,
                                                    row.values[3] == check.service_rate,
                                                    row.values[4] == check.sinking_fund,
                                                    row.values[5] == check.overstay_rate){

                                                }else{
                                                    var updateUnitRate = await updateUnitRate(row.values[1].replace(/"+/ig, ''), {
                                                    unit_rate_name: row.values[2],
                                                    service_rate: row.values[3],
                                                    sinking_fund: row.values[4],
                                                    overstay_rate: row.values[5],
                                                
                                                });
                                                }
                                            }
                                        } else {
                                            var newUnitrate = await addUnitRate({
                                                unit_rate_name: row.values[2],
                                                service_rate: row.values[3],
                                                sinking_fund: row.values[4],
                                                overstay_rate: row.values[5],
                                                                                                
                                                });
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadBlockExcel: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "block"){
                            var worksheet = workbook.getWorksheet('block');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Block Code" && row.values[3] == "Block Name" && row.values[4] == "Block Address"){
                                        validated = true;     
                            }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await findBlockById(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.cdblk &&
                                                row.values[3] == check.nmblk &&
                                                row.values[4] == check.addrblk &&
                                                row.values[5] == check.phnblk &&
                                                row.values[6] == check.grpid &&
                                                row.values[7] == check.rt &&
                                                row.values[8] == check.rw
                                     ){
                                                }else{
                                                    var project = await findAllGroup({grpnm: row.values[6]});
                                                    var updBlock = await updateBlock(row.values[1].replace(/"+/ig, ''),
                                                        {
                                                            cdblk: row.values[2],
                                                            nmblk: row.values[3],
                                                            addrblk: row.values[4],
                                                            phnblk: row.values[5],                                  
                                                            grpid: project[0]._id,
                                                            rt: row.values[7],
                                                            rw: row.values[8],  

                                                        });
    
                                                }
                                            }
                                        } else {
                                            var project = await findAllGroup({grpnm: row.values[6]});
                                            var newBlock = await addBlock({
                                                cdblk: row.values[2],
                                                nmblk: row.values[3],
                                                addrblk: row.values[4],
                                                phnblk: row.values[5],
                                                grpid: project[0]._id,
                                                rt: row.values[7],
                                                rw: row.values[8], 
                                            });
                                   
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadFloor: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "floor"){
                            var worksheet = workbook.getWorksheet('floor');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Floor Code" && row.values[3] == "Floor Name" && row.values[4] == "Block Code"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await findFloorById(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.cdflr &&
                                                    row.values[3] == check.nmflr &&
                                                    row.values[4] == check.blk){

                                                }else{
                                                    var getblk = await listBlock({cdblk: row.values[4]});
                                                    var updateFlr = await updateFloor({
                                                        cdflr: row.values[2],
                                                        nmflr: row.values[3],
                                                        blk: getblk[0]._id,
                                                    }, row.values[1].replace(/"+/ig, ''));
                                                }
                                            }
                                        } else {
                                            var getblk = await listBlock({cdblk: row.values[4]});
                                            var newFloor = await addFloor({
                                                cdflr: row.values[2],
                                                nmflr: row.values[3],
                                                blk: getblk[0]._id,
                                            });
                                            
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadCustomer: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "tenant"){
                            var worksheet = workbook.getWorksheet('tenant');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Tenant Code" && row.values[3] == "Tenant Nik" && row.values[4] == "Tenant Name"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await findByCustomerId(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(
                                                    row.values[2] == check.cstrmrcd &&
                                                    row.values[3] == check.cstrmrpid &&
                                                    row.values[4] == check.cstrmrnm &&
                                                    row.values[5] == check.npwp &&
                                                    row.values[6] == check.addrcstmr &&
                                                    row.values[7] == check.phncstmr &&
                                                    row.values[8] == check.emailcstmr &&
                                                    row.values[9] == check.gndcstmr &&
                                                    row.values[10] == check.idvllg.id &&
                                                    row.values[11] == check.postcode &&
                                                    row.values[12] == check.type &&
                                                    row.values[13] == check.bankname &&
                                                    row.values[14] == check.bankaccnt
                                                ){

                                                }else{
                                                    var vill = await listVillage({name: row.values[10]});
                                                    var updateCustomer = await editCustomer( row.values[1]  .replace(/"+/ig, ''),
                                                        {
                                                            cstrmrcd: row.values[2],
                                                            cstrmrpid: row.values[3],
                                                            cstrmrnm: row.values[4],
                                                            npwp: row.values[5],
                                                            addrcstmr: row.values[6],
                                                            phncstmr: row.values[7],
                                                            emailcstmr: row.values[8],
                                                            gndcstmr: row.values[9],
                                                            idvllg: vill[0]._id,
                                                            postcode: row.values[11],
                                                            type: row.values[12],
                                                            bankname: row.values[13],
                                                            bankaccnt: row.values[14],
                                                        });
                                                }
                                            }
                                        } else {
                                            var vill = await listVillage({name: row.values[10]});
                                            var newCust = await addCustomer({
                                                cstrmrcd: row.values[2],
                                                cstrmrpid: row.values[3],
                                                cstrmrnm: row.values[4],
                                                npwp: row.values[5],
                                                addrcstmr: row.values[6],
                                                phncstmr: row.values[7],
                                                emailcstmr: row.values[8],
                                                gndcstmr: row.values[9],
                                                idvllg: vill[0]._id,
                                                postcode: row.values[11],
                                                type: row.values[12],
                                                bankname: row.values[13],
                                                bankaccnt: row.values[14],
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadUnit2: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "unit"){
                            var worksheet = workbook.getWorksheet('unit');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Unit Code" && row.values[3] == "Unit Name" && row.values[4] == "Unit Number"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await listUnitById(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(
                                                    row.values[2] == check.cdunt &&
                                                    row.values[3] == check.nmunt &&
                                                    row.values[4] == check.untnum &&
                                                    row.values[5] == check.unttp &&
                                                    row.values[6] == check.untsqr &&
                                                    row.values[7] == check.untlen &&
                                                    row.values[8] == check.untwid &&
                                                    row.values[9] == check.flr &&
                                                    row.values[10] == check.untrt &&
                                                    row.values[11] == check.srvcrate &&
                                                    row.values[12] == check.ovstyrate &&
                                                    row.values[13] == check.sinkingfund
                                                    
                                                    
                                                ){

                                                }else{
                                                    var unitaip = await listUnitType({unttp: row.values[5]});
                                                    var flr = await listFloor({cdflr: row.values[9]});
                                                    var untrt = await listUnitRate({unit_rate_name: row.values[10]});
                                                    var update = await updateUnit( row.values[1]  .replace(/"+/ig, ''),
                                                        {
                                                            cdunt: row.values[2],
                                                            nmunt: row.values[3],
                                                            untnum: row.values[4],
                                                            unttp: unitaip[0]._id,
                                                            untsqr: row.values[6],
                                                            untlen: row.values[7],
                                                            untwid: row.values[8],
                                                            flr: flr[0]._id,
                                                            untrt: untrt[0]._id,
                                                            srvcrate: row.values[11],
                                                            ovstyrate: row.values[12],
                                                            sinkingfund: row.values[13]

                                                            
                                                        });
                                                    
                                                }
                                            }
                                        } else {
                                            var unitaip = await listUnitType({unttp: row.values[5]});
                                            var flr = await listFloor({cdflr: row.values[9]});
                                            var unitret = await listUnitRate({unit_rate_name: row.values[10]});
                                            console.log(unitret);
                                            var newCust = await addUnit({
                                                            cdunt: row.values[2],
                                                            nmunt: row.values[3],
                                                            untnum: row.values[4],
                                                            unttp: unitaip[0]._id,
                                                            untsqr: row.values[6],
                                                            untlen: row.values[7],
                                                            untwid: row.values[8],
                                                            flr: flr[0]._id,
                                                            untrt: unitret[0]._id,
                                                            srvcrate: row.values[11],
                                                            ovstyrate: row.values[12],
                                                            sinkingfund: row.values[13]
                                                       
                                              
                                            });
                                            
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadOwner: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "owner"){
                            var worksheet = workbook.getWorksheet('owner');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Tenant Name" && row.values[3] == "Contract Number" && row.values[4] == "Contract Date"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await getOwnership(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(
                                                    row.values[2] == check.cstmr &&
                                                    row.values[3] == check.contract_number &&
                                                    row.values[4] == check.contract_date &&
                                                    row.values[5] == check.expiry_date &&
                                                    row.values[6] == check.contact_name &&
                                                    row.values[7] == check.contact_address &&
                                                    row.values[8] == check.contact_phone &&
                                                    row.values[9] == check.contact_city &&
                                                    row.values[10] == check.contact_zip &&
                                                    row.values[11] == check.unit &&
                                                    row.values[12] == check.paymentType &&
                                                    row.values[13] == check.paymentTerm &&
                                                    row.values[14] == check.start_electricity_stand &&
                                                    row.values[15] == check.start_water_stand &&
                                                    row.values[16] == check.virtualAccount &&
                                                    row.values[17] == check.tax_id
                                                ){

                                                }else{
                                                    var cust = await listCustomer({cstrmrnm: row.values[2]});
                                                    var unt = await listUnit({nmunt: row.values[11]});
                                                    var updateOwnership = await editOwnership( row.values[1]  .replace(/"+/ig, ''),
                                                        {
                                                            cstmr: cust[0]._id,
                                                            contract_number: row.values[3],
                                                            contract_date: row.values[4],
                                                            expiry_date: row.values[5],
                                                            contact_name: row.values[6],
                                                            contact_address: row.values[7],
                                                            contact_phone: row.values[8],
                                                            contact_city: row.values[9],
                                                            contact_zip: row.values[10],
                                                            unit: unt[0]._id,
                                                            paymentType: row.values[12],
                                                            paymentTerm: row.values[13],
                                                            start_electricity_stand: row.values[14],
                                                            start_water_stand: row.values[15],
                                                            virtualAccount: row.values[16],
                                                            tax_id: row.values[17],
                                                        });
                                                }
                                            }
                                        } else {
                                            var cust = await listCustomer({cstrmrnm: row.values[2]});
                                            var unt = await listUnit({nmunt: row.values[11]});
                                            var newOwnr = await addOwnership({
                                                cstmr: cust[0]._id,
                                                contract_number: row.values[3],
                                                contract_date: row.values[4],
                                                expiry_date: row.values[5],
                                                contact_name: row.values[6],
                                                contact_address: row.values[7],
                                                contact_phone: row.values[8],
                                                contact_city: row.values[9],
                                                contact_zip: row.values[10],
                                                unit: unt[0]._id,
                                                paymentType: row.values[12],
                                                paymentTerm: row.values[13],
                                                start_electricity_stand: row.values[14],
                                                start_water_stand: row.values[15],
                                                virtualAccount: row.values[16],
                                                tax_id: row.values[17],
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadLease: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "lease"){
                            var worksheet = workbook.getWorksheet('lease');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                if(rowNumber == 1){
                                    if(row.values[2] == "Tenant Name" && row.values[3] == "Tenant Number" && row.values[4] == "Contract Date"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await getTenant(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(
                                                    row.values[2] == check.cstmr &&
                                                    row.values[3] == check.contract_number &&
                                                    row.values[4] == check.contract_date &&
                                                    row.values[5] == check.expiry_date &&
                                                    row.values[6] == check.contact_name &&
                                                    row.values[7] == check.contact_address &&
                                                    row.values[8] == check.contact_phone &&
                                                    row.values[9] == check.contact_city &&
                                                    row.values[10] == check.contact_zip &&
                                                    row.values[11] == check.unit &&
                                                    row.values[12] == check.paymentType &&
                                                    row.values[13] == check.paymentTerm &&
                                                    row.values[14] == check.start_electricity_stand &&
                                                    row.values[15] == check.start_water_stand &&
                                                    row.values[16] == check.virtualAccount &&
                                                    row.values[17] == check.tax_id
                                                ){

                                                }else{
                                                    var cust = await listCustomer({cstrmrnm: row.values[2]});
                                                    var unt = await listUnit({nmunt: row.values[11]});
                                                    var updateOwnership = await editTenant( row.values[1]  .replace(/"+/ig, ''),
                                                        {
                                                            cstmr: cust[0]._id,
                                                            contract_number: row.values[3],
                                                            contract_date: row.values[4],
                                                            expiry_date: row.values[5],
                                                            contact_name: row.values[6],
                                                            contact_address: row.values[7],
                                                            contact_phone: row.values[8],
                                                            contact_city: row.values[9],
                                                            contact_zip: row.values[10],
                                                            unit: unt[0]._id,
                                                            paymentType: row.values[12],
                                                            paymentTerm: row.values[13],
                                                            start_electricity_stand: row.values[14],
                                                            start_water_stand: row.values[15],
                                                            virtualAccount: row.values[16],
                                                            tax_id: row.values[17],
                                                        });
                                                }
                                            }
                                        } else {
                                            var cust = await listCustomer({cstrmrnm: row.values[2]});
                                            var unt = await listUnit({nmunt: row.values[11]});
                                            var newOwnr = await addTenant({
                                                cstmr: cust[0]._id,
                                                contract_number: row.values[3],
                                                contract_date: row.values[4],
                                                expiry_date: row.values[5],
                                                contact_name: row.values[6],
                                                contact_address: row.values[7],
                                                contact_phone: row.values[8],
                                                contact_city: row.values[9],
                                                contact_zip: row.values[10],
                                                unit: unt[0]._id,
                                                paymentType: row.values[12],
                                                paymentTerm: row.values[13],
                                                start_electricity_stand: row.values[14],
                                                start_water_stand: row.values[15],
                                                virtualAccount: row.values[16],
                                                tax_id: row.values[17],
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadMasterPower: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "master power"){
                            var worksheet = workbook.getWorksheet('master power');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                console.log(row.values);
                                if(rowNumber == 1){
                                    if(row.values[2] == "Nomor Meter" && row.values[3] == "Unit"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await listPower(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.nmmtr,
                                                    row.values[3] == check.unt,
                                                    row.values[4] == check.rte){

                                                }else{
                                                    var rate = await listRatePower({rte: row.values[4]});
                                                    var unit = await listUnit({cdunt: row.values[3]});
                                                    var updatePowerMas = await updatePower(row.values[1].replace(/"+/ig, ''), {
                                                    nmmtr: row.values[2],
                                                    unt: unit[0].id,
                                                    rte: rate[0].id
                                                
                                                });
                                                console.log('A');

                                                }
                                            }
                                        } else {
                                            var rate = await listRatePower({rte: row.values[4]});
                                            var unit = await listUnit({cdunt: row.values[3]});
                                            var newPowerMas = await addPower({
                                                    nmmtr: row.values[2],
                                                    unt: unit[0].id,
                                                    rte: rate[0].id
                                                                                                
                                                });
                                                console.log('B');
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    uploadMasterWater: async function(req, res, next){
        const file = req.file;
        if(file){
            var workbook = new excel.Workbook();
            await workbook.xlsx.readFile(`${file.path}`).then(
                function () {
                    workbook.eachSheet(function(sheet, sheetId){
                        if(sheet.name == "master water"){
                            var worksheet = workbook.getWorksheet('master water');
                            var validated = false;
                            worksheet.eachRow(async function (row, rowNumber) {
                                console.log(row.values);
                                if(rowNumber == 1){
                                    if(row.values[2] == "Nomor Meter" && row.values[3] == "Unit"){
                                        validated = true;
                                    }
                                }else{
                                    if(validated){
                                        if(row.values[1] !== undefined){
                                            var check = await listPower(row.values[1].replace(/"+/ig, ''));
                                            if(check){
                                                if(row.values[2] == check.nmmtr,
                                                    row.values[3] == check.unt,
                                                    row.values[4] == check.rte){

                                                }else{
                                                    var rate = await listRateWater({rte: row.values[4]});
                                                    var unit = await listUnit({cdunt: row.values[3]});
                                                    var updatePowerMas = await updateWater(row.values[1].replace(/"+/ig, ''), {
                                                    nmmtr: row.values[2],
                                                    unt: unit[0].id,
                                                    rte: rate[0].id
                                                
                                                });
                                                console.log('A');

                                                }
                                            }
                                        } else {
                                            var rate = await listRateWater({rte: row.values[4]});
                                            var unit = await listUnit({cdunt: row.values[3]});
                                            var newPowerMas = await addWater({
                                                    nmmtr: row.values[2],
                                                    unt: unit[0].id,
                                                    rte: rate[0].id
                                                                                                
                                                });
                                                console.log('B');
                                        }
                                    }
                                }
                            });
                        }
                    });

                }
            );
            fs.unlink(`${file.path}`, ()=>{});
            res.status(200).json({status: "success"});
        }else{
            const error = new Error('please upload your file');
            error.httpStatusCode = 400;
            return next(error)
        }
    },
    // uploadMasterGas: (req, res, next)=>{
    //     try{
    //         const file = req.file;
    //         if (file) {
    //             const workbook = new excel.Workbook();
    //             workbook.xlsx.readFile(`${file.path}`).then((result) => {
    //                 workbook.eachSheet((sheet, sheetId)=>{
    //                     if (sheet.name.toLowerCase() === "gas" || sheet.name.toLowerCase() === "master gas") {
    //                         const worksheet = workbook.getWorksheet(sheet.name);
    //                         let validated = false;
    //                         worksheet.eachRow(async(row, rowNumber)=>{
    //                             if (rowNumber === 1) {
    //                                 row.values[1].toLowerCase() === "nomor meter"?validated=true:validated=false;
    //                             } else {
    //                                 if(validated){
    //                                     if(row.values[1] !== undefined){
    //                                         let gas = "";
    //                                         let unit = "";
    //                                         const listGasRate = await mstGasRate.listRateGas({rte: row.values[3]}, 1, 100000);
    //                                         gas = listGasRate[0].id;
    //                                         const unitList = await listUnit({cdunt: row.values[2]}, 1, 100000);
    //                                         unit = unitList[0].id;
    //                                         serviceGasMst.addGas({
    //                                             nmmtr: row.values[1],
    //                                             unt: unit,
    //                                             rte: gas
    //                                         }).then((result) => {
    //                                             fs.unlink(`${file.path}`, ()=>{});
    //                                             res.status(200).json({status: "success"});
    //                                         }).catch((err) => {
    //                                             errorHandler(err);
    //                                         });
    //                                     }
    //                                 }
    //                             }
    //                         })
    //                     }
    //                 });
    //             }).catch((err) => {
    //                 // console.error(err);
    //                 errorHandler(err);
    //             });
    //         }else{
    //             const error = new Error('please upload your file');
    //             error.httpStatusCode = 400;
    //             return next(error)
    //         }
    //     }catch(error){
    //         // console.error(error);
    //         errorHandler(error);
    //     }
    // }
}