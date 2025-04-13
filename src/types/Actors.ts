enum Actors {
    CAT = 'cat',
    RAT = 'rat',
    NONE = 'none',
}

export default Actors;
export type Actor = Actors.CAT | Actors.RAT | Actors.NONE;