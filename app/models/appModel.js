/* ===================
    Variables
   =================== */

// Main dependecies
var Schema = _MONGOOSE.Schema;

/* ===================
    Schema
   =================== */

var appSchema = new Schema({

    name: {
        type: String,
        default: '',
        trim: true,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    path: {
        type: String,
        default: '',
        trim: true,
    },
    modules: [
        {
            type: Schema.Types.ObjectId,
            ref: "Module"
        }
    ],
    // Defaults     
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

/* ===================
    Methods
   =================== */

appSchema.method({

    createIt: function(callback) {
        console.log(_DEBUG + "CREATING APP..."); //DEBUG
        var self = this;
        self.save(callback);
    }

});

/* ===================
    Statics
   =================== */

appSchema.static({

    readIt: function(id, callback) {
        console.log(_DEBUG + "READING APP..."); //DEBUG
        this.findOne({
              _id: id
            })
            .populate("modules.name", "name").exec(callback)
    },

    updateIt: function(id, object, modifiedBy, callback) {
        console.log(_DEBUG + "UPDATING APP..."); //DEBUG
        this.update(
            { _id: id }, 
            { 
                //Estos params son custom según el modelo que se esté actualizando
                name: object.name,
                description: object.description,
                path: object.path,
                modules: object.modules,
                modifiedAt: Date.now(),
                modifiedBy: modifiedBy
            }, 
            null, callback);
    },

    //No lo borra realmente, solo lo "deshabilita"
    deleteIt: function(id, modifiedBy, callback) {
        console.log(_DEBUG + "DELETING APP..."); //DEBUG
        this.update(
            { _id: id }, 
            { 
                modifiedBy: modifiedBy,
                deletedAt: Date.now(), //Le quita el NULL default, y le pone la fecha de hoy
            }, 
            null, callback);
    },

    loadAll: function(callback) {
        console.log(_DEBUG + "LOADING APPS..."); //DEBUG
        this.find().populate("modules.name", "name").sort('createdAt').exec(callback)
    },
});

/* ===================
    Register
   =================== */

_MONGOOSE.model('App', appSchema);