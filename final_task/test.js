var target = document.getElementById("change-isovalue-button");
var slider = document.getElementById("isovalue");

function OnButtonClick() {
  screen.scene.remove(surfaces);
  surfaces = Isosurfaces( volume, slider.value );
  screen.scene.add( surfaces );
}

slider.addEventListener("input", function() {
// ドラッグ中のイベント
  target.innerHTML = "isovalue="+slider.value;
}, false);
