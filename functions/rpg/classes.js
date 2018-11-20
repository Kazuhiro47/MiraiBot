class Player {
    constructor(name) {
        this.name = name;
        this.hp = 100;
        this.strength = 10;
        this.defence = 5;

        return this;
    }
}

class Ally extends Player {
    constructor(name) {
        super(name);

        this.enemy = false;
        return this;
    }
}

class Enemy extends Player {
    constructor(name) {
        super(name);

        this.enemy = true;
        return this;
    }

}

class Junko extends Enemy {
    constructor(name) {
        super(name);

        this.hp = 1000;
        this.strength = 14;
        this.defence = 2;
        return this;
    }
}

class Naegi extends Ally {

}

module.exports = {Junko, Naegi};
