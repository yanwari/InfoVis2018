var isovalue = 128;
var cmap_select = 0;
var shader = 0;
var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();
    screen.init( volume, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight,
        enableAutoResize: false
    });
var surfaces = Isosurfaces( volume, isovalue, cmap_select, shader, screen);
var target = document.getElementById("change-isovalue-button");
var slider = document.getElementById("isovalue");



function OnButtonClick() {
  screen.scene.remove(surfaces);
  surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen );
  screen.scene.add( surfaces );
}
slider.addEventListener("input", function() {
// ドラッグ中のイベント
  target.innerHTML = "isovalue="+slider.value;
}, false);

function OnRainbowClick(){
    cmap_select = 0;
    screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen );
  screen.scene.add( surfaces );
}

function OnRedWhiteClick(){
    cmap_select = 1;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen );
  screen.scene.add( surfaces );
}

function OnGreyClick(){
    cmap_select = 2;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen );
  screen.scene.add( surfaces );
}

function OnLambertianClick(){
    shader = 0;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select, shader, screen );
  screen.scene.add( surfaces );
}

function OnBlinnPhongClick(){
    shader = 1;
      screen.scene.remove(surfaces);
    surfaces = Isosurfaces( volume, slider.value, cmap_select,shader, screen );
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

/*    if(shader == 0){
    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById('Lambertian.vert').text,
        fragmentShader: document.getElementById('Lambertian.frag').text,
	uniforms: {
	    light_position: {type: 'v3',value: screen.light.position},
	    camera_position: {type: 'v3',value: screen.camera.position}
	}  
    });
    }else if(shader == 1){
     var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById('BlinnPhong.vert').text,
        fragmentShader: document.getElementById('BlinnPhong.frag').text,
	uniforms: {
	    light_position: {type: 'v3',value: screen.light.position},
	    camera_position: {type: 'v3',value: screen.camera.position}
	}  
    });
}*/
    screen.loop();
}
