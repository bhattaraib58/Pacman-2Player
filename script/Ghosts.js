class Ghosts
{
  constructor()
  {
    var position  = null,
        direction = null,
        eatable   = null,
        eaten     = null,
        due       = null;


        return {
          "eat"         : eat,
          "isVunerable" : isVunerable,
          "isDangerous" : isDangerous,
          "makeEatable" : makeEatable,
          "reset"       : reset,
          "move"        : move,
          "draw"        : draw
      };
  }


      
   isVunerable() { 
    return eatable !== null;
};

 isDangerous() {
    return eaten === null;
};

 isHidden() { 
    return eatable === null && eaten !== null;
};
}
