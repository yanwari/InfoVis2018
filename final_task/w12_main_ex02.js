var isovalue = 128;
var cmap_select = 0;
var shader = 0;
var slice = 0;
var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();
    screen.init( volume, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        enableAutoResize: false
    });
var surfaces = Isosurfaces( volume, isovalue, cmap_select, shader, screen, slice);
var target = document.getElementById("change-isovalue-button");
var slider = document.getElementById("isovalue");



function OnButtonClick() {
  screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen, slice );
  screen.scene.add( surfaces );
}
slider.addEventListener("input", function() {
// ドラッグ中のイベント
  target.innerHTML = "isovalue="+slider.value;
}, false);

function OnRainbowClick(){
    cmap_select = 0;
    screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen, slice );
  screen.scene.add( surfaces );
}

function OnRedWhiteClick(){
    cmap_select = 1;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen, slice );
  screen.scene.add( surfaces );
}

function OnGreyClick(){
    cmap_select = 2;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen, slice );
  screen.scene.add( surfaces );
}

function OnLambertianClick(){
    shader = 0;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen, slice );
  screen.scene.add( surfaces );
}

function OnBlinnPhongClick(){
    shader = 1;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select,shader, screen, slice );
  screen.scene.add( surfaces );
}

function OnSliceClick(){
    slice = (1+slice)%2;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select,shader, screen, slice );
  screen.scene.add( surfaces );
}

function main()
{
/*    screen.init( volume, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        enableAutoResize: false
    });*/

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

    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );
    screen.scene.add( light );

    screen.loop();
}
