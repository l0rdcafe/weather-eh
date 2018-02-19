const model = (function() {
  const coords = [];
  const state = {
    coords
  };
  const setCoords = function(coordsArr) {
    coordsArr.forEach(coord => {
      state.coords.push(coord);
    });
  };

  return {
    state,
    setCoords
  };
})();
