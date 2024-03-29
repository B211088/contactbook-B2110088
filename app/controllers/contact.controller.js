const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");



exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(404, "Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error){
        return next(
            new ApiError(500, "An erroro occurred while creating the contact.")
        );
    }
}

exports.findAll = async (req, res, next ) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if(name){
            documents = await contactService.findByName(name);
        }else{
            documents = await contactService.find({});
        }
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res) => {
    if(Object.keys(req.body).length === 0 ){
        return next(new ApiError(404, "Data to update can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.update(req.params.id, req.body);
        if(!documents){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact updated successfully"});
    }catch(error){
        return next(
            new ApiError(500, `Error updating contact with id ${req.params.id}`)
        )
    }
};

exports.detele = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.detele(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    }catch(error){
        return next(
            new ApiError(500, `Could not delete contact with id="${req.params.id}`)
        );
    }
};

exports.deteleALL = (req, res, next) => {
    res.send({message: "deteleALL handler"});
};

exports.findAllFavorite = async  (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findAllFavorite();
        return res.send(documents);
    }catch(error){
        return next(
            new ApiError(500, "An error occurred while retrieving favorites contacts")
        );
    }
};

