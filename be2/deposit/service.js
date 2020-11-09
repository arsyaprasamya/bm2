const { Tenant } = require('../contract/tenant/model');
const user = require('../models/user');

/**
 * Deposit Database Services
 */
const Deposit = require('./model').Deposit;
const Ownership = require('../contract/owner/model').Ownership;
const Lease = require('../contract/tenant/model').Tenant;
// const User = require("../../models/user").User;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports = {
    findAllDeposit : async function(query, page = 1, limit = 1000){
        try{
            var skip = (page - 1) * limit;
            let deposit;
            if(Object.keys(query).length === 0){
            deposit = await Deposit.find(query).skip(skip).limit(limit).sort({$natural:-1}).lean();
            }else{
            deposit = await Deposit.find().or({ 'depositno': { $regex: `${query.depositno}` }}).skip(skip).limit(limit)
            .populate({
                path: 'invoice',
                model: 'Invoice',
                select: '-__v',
                }).sort({$natural:-1}).lean();
            }
            if(deposit){
                return deposit;
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }
    },



    findByDepositId : async function(id){
        try {
            var deposit = await Deposit.findById(id);
            
            let dataContract;
            dataContract = await Lease.findOne({_id: deposit.contract}).populate('unit', '-__v');
            if (dataContract === null || Object.keys(dataContract).length === 0) {
                dataContract = await Ownership.findOne({_id: deposit.contract}).populate('unit', '-__v');   
            }
            deposit.cdunit = dataContract.unit.cdunt;
           
            return deposit;
        }catch (e) {
            console.log(e);
        }
    },


    
    addDeposit : async function(body){
        try {
            var deposit = await new Deposit(body).save();
            if(deposit){
                return deposit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },



    updateDeposit: async function(id, body){
        try{
            const deposit = await Deposit.findByIdAndUpdate(id,body);

            if(deposit){
                const data = { isclosed : body.isactive};

                const updateInvoice =  await Invoice.findOneAndUpdate(
                    { invoiceId : body.Invoice},
                    data);
                
                if (updateInvoice){
                    return deposit;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteDeposit : async function(id){
        try {
            var deposit = await Deposit.findByIdAndRemove(id);
            if (deposit){
                return deposit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    
// Service Mobile delete Deposit
    GenerateInvCode : async function(val){
        try {
            var a = new Date(); 
            var month = ("0" + (a.getMonth() + 1)).slice(-2); 
            var date = ("0" + a.getDate()).slice(-2); 
            var year = a.getFullYear().toString().substr(-2);
            const ticketCount = await Deposit.countDocuments();
            const newNumber = pad(ticketCount+1,5);
            //var unique = Math.floor(1000 + Math.random() * 9000);
            var code = ('KWI-'+ date + month + year + '-' + newNumber);
            return code;
        }catch (e) {
            console.log(e);
        }
    },


    //mobile
    
    findByDepositMobile : async function(id){ //buat fungsi dengan nama findByDepositMobile dengan pengeksekusian menggunakan metode async dengan paramater spesifik by ID
        try {
           const dataUser = await User.findById(id); //bikin variabel datauser dengan nama skema User dengan memakai query mongoose findbyid (spesifik parameter ID)
        //    console.log('id user: ' + dataUser)  // tes dengan nampilin data diatas pake biar nampil di console dengan nampilin spesifik id user dalam variabel DataUser
           let dataContract; //pendeklarasian variabel dataContract
           dataContract = await Ownership.findOne({ cstmr: dataUser.tenant }); //pada variabel datacontract ngambil data dari skema Ownership dengan menggunakan query mongoose findOne ngambil spesifik yaitu field cstmr yg isinya field tenant yg ada dalam variabel dataUser 
           if (!dataContract) { //jika if bukan variabel data contract  != negasi(kebalikan)
                    dataContract = await Lease.findOne({ cstmr: dataUser.tenant }); // kelanjutan dari if maka fungsi ini akan dijalankan dimana variabel data contract isinya diambil dari skema lease dengan menggunkaan query mongoose findOne dengan spesifik yaitu field cstmr yg isinya tenant yg ada di dalam variabel dataUser
               }

            const data = await Deposit.find({ contract: dataContract._id }) //buat variaabel konstanta dengan nama data dimana ngambil data dalam skema Deposit menggunakan query mongoose find ngambil spesifik field contract yg isinya ID yg ada di dalam variabel dataContract
                        .populate("contract", "-__v") // populate contract
                        .lean();
            
            console.log(data) // nampilin console yg isinya variabel data 
            return data;
        }catch (e) {
            console.log(e);
        }
    },
    addDepositMobile : async function(body){ // buat fungsi dengan nama addDepositMobile dengan metode async dimana parameter spesifik nya yaitu body
        try {
            var deposit = await new Deposit(body).save(); // bikin variabel deposit dimana datanya diambil dari schema new Deposit dengan parameter spesifik yaitu body kemudian menggunakan query mongoose save untuk menyimpan body yang diisi
            if(deposit){ // jika variabel deposit maka akan menjalankan variabel deposit
                return deposit; //kemudian kembali ke vaariabel deposit
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },


    updateDepositMobile: async function(id, body){ //buat fungsi dengan nama updateDepositMobile dengan metode async dimana fungsi yang dipangil spesifik pada id dan body 
        try{
            var deposit = await Deposit.findByIdAndUpdate(id,body); // buat variabel deposit diman isinya itu didapat dari schema Deposit kemudian menggunakan query mongoose dengan findByIdAndUpdate artinya mencari berdasarkan spesifik ID kemudian update/merubah terdapat ID sebagai spesifik pencarian kemduian apa yang diubah yaitu body
            if(deposit){ //jika pada variabel deposit 
                return deposit; // maka akan kembali ke variabel deposit untuk dijalankan
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    deleteDepositMobile : async function(id){
        try {
            var deposit = await Deposit.findByIdAndRemove(id);
            if (deposit){
                return deposit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    findAllDepositMobile : async function(query, page = 1, limit = 1000){ // buat fungsi dengan nama findAllDepositMobile menggunakan metode async dengan spesifik yang akan di tampilan paramater statik query dengan page isinya 1 dan limit nilai maksimal 1000
        try{
            var skip = (page - 1) * limit; // buat variabel skip dengan isi ketika pindah page nilai maksimal nya berjumlah limit maksimal yaitu 1000
            deposit = await Deposit.find().skip(skip).limit(limit).sort({$natural:-1}).lean(); // variabel deposit tidak menggunakan var/cons karena nilainya pasti berubah. kemudian ngambil data schema Deposit menggunakan query mongoose find kemudian query skip untuk pindah halaman kemudian query limit untuk maksimal limit 1000 yg bakal tampil kemudian sort menggunakan $natural -1 fungsinya untuk LIFO last in first Out buat nampilin nanti
            
            if (deposit){ //jika pada variabel deposit
                deposit.forEach(async element => { //pada vaiabel deposit menjalankan query mongoose yaitu forEach yang fungsinya untuk menjalankan setiap element dari index yg terkecil ke yg terbesar
                    let dataContract; //pendeklarasian dataContract
                    dataContract = await Lease.findOne({_id: element.contract}).populate('unit', '-__v'); ///pada variabel dataContract mengambil data dari schema Lease menggunakan query mongoose findOne dan mengambil spesifik field _id yang isinya parameter contract yang ada didalam parameter element kemudian hasil data yang diambil di populate
                    if (dataContract === null || Object.keys(dataContract).length === 0) { //jika variabel data konttrak isinya null maka akan menjalankan fungsi Object dengan Key variabel dataContract dengan length = 0
                        dataContract = await Ownership.findOne({_id: element.contract}).populate('unit', '-__v'); // pada variabel dataContract mengambil data dari schema Ownership menggunakan query mongoose findOne dimana data yang diambil yaitu index _id yang isinya parameter contract yg ada di dalam parameter element    
                    }
                    element.cdunit = dataContract.unit.cdunt; // pada variabel element isinya yg diambil adalah index cdunit kemudian pada variabel dataContract yang diambil parameter unit yg didalamnya terdapat index cdunt
                });
                return deposit; // return nampilin isi dari variabel deposit 
            }else{
                false;
            }
            
        }catch (e) {
            console.log(e);
        }
    },
}