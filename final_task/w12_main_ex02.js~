var isovalue = 128;
var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();
var surfaces = Isosurfaces( volume, isovalue );
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

function main()
{
    screen.init( volume, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        enableAutoResize: false
    });

    var bounds = Bounds( volume );
    screen.scene.add( bounds );

    screen.scene.add( surfaces );

    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth * 0.8, window.innerHeight ] );
    });
    console.log(isovalue)
    screen.loop();
}
