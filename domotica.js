var domotica = {
    rooms: {
        salon: {
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            aire: {state: false, value: false}
        },
        patio: {
            puerta: {state: false, value: false},
            luz: {state: false, value: false},
            alarma: {state: false, value: false},
            timbre: {state: false, value: false}
        },
        habitacion: {
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            aire: {state: false, value: false}
        },
        cocina: {
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            vitro: {state: false, value: false}
        }
    },
    showRooms: function () {
        self = this;
        for (var room in self.rooms) {
            var p = self.rooms[room];
            console.log("** " + room + " **");
            for (var a in p) {
                console.log(a + ": state -> " + p[a].state +
                    " value -> " + p[a].value);
            }
        }
    }
};

module.exports = domotica;
