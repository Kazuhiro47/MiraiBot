class Fight {
    constructor() {
        return this;
    }
}

class GroupDuel extends Fight {
    constructor(team1, team2) {
        super();

        this.team1 = team1;
        this.team2 = team2;

        return this;
    }
}

class Duel extends Fight {
    constructor(player1, player2) {
        super();

        this.oponent1 = player1;
        this.oponent2 = player2;

        return this;
    }

    duel() {

    }
}
