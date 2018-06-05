function Isosurfaces( volume, isovalue, cmap_select, shader, screen, slice )
{
    
    var geometry = new THREE.Geometry();
    //var material = new THREE.MeshLambertMaterial();
    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );

    var point = new THREE.Vector3(60,60,17);
    var normal = new THREE.Vector3(1,0,4);
    var w = -normal.x * point.x - normal.y * point.y - normal.z * point.z;
    var coef = new THREE.Vector4( normal.x, normal.y, normal.z, w );
    
    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();

    console.log(cmap_select);
    if(cmap_select == 0){
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    }else if(cmap_select == 1){
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i/255.0 ;
        var R = 1;
        var G = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    }else if(cmap_select == 2){
	var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i/255.0 ;
        var R = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var G = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    }else{
  console.log("おい")
    }

    
    var cell_index = 0;
    var counter = 0;
    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
		if(slice == 0){
                var indices = cell_node_indices( cell_index++ );
                    var index = table_index( indices );
		}else if(slice == 1){
		    var index = table_slice_index(x, y, z)
		}
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j+1];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );

		    if(slice == 0){
                    var v01 = interpolated_vertex( v0, v1, isovalue );
                    var v23 = interpolated_vertex( v2, v3, isovalue );
                    var v45 = interpolated_vertex( v4, v5, isovalue );
		    }else if(slice == 1){
                    var v01 = interpolated_slice_vertex( v0, v1);
                    var v23 = interpolated_slice_vertex( v2, v3);
                    var v45 = interpolated_slice_vertex( v4, v5);
		    }
                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );


		    if(slice == 1){
                    var s0 = interpolated_slice_value( v0, v1 );
                    var s1 = interpolated_slice_value( v2, v3 );
			var s2 = interpolated_slice_value( v4, v5 );
	
                    var c0 = new THREE.Color().setHex( cmap[s0][1]);
                    var c1 = new THREE.Color().setHex( cmap[s1][1]);
                    var c2 = new THREE.Color().setHex( cmap[s2][1]);

                    var face = new THREE.Face3( id0 , id1 , id2 );
                    face.vertexColors.push( c0 );
                    face.vertexColors.push( c1 );
                    face.vertexColors.push( c2 );
                    geometry.faces.push( face );
		    }
                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;
		    if(slice == 0){
			geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );
		    }
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    if(slice == 0){
    geometry.computeVertexNormals();
    
    if(shader == 0){
    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById('Lambertian.vert').text,
        fragmentShader: document.getElementById('Lambertian.frag').text,
	uniforms: {
	    light_position: {type: 'v3',value: light.position},
	    camera_position: {type: 'v3',value: screen.camera.position},
	    c: { type:'c', value: new THREE.Color().setHex( cmap[isovalue][1]) }
	}  
    });
    }else if(shader == 1){
     var material = new THREE.ShaderMaterial({
         vertexColors: THREE.VertexColors,
	 vertexColors: new THREE.Color().setHex( cmap[isovalue][1] ),
        vertexShader: document.getElementById('BlinnPhong.vert').text,
        fragmentShader: document.getElementById('BlinnPhong.frag').text,
	uniforms: {
	    light_position: {type: 'v3',value: light.position},
	    camera_position: {type: 'v3',value: screen.camera.position},
	    c: { type:'c', value: new THREE.Color().setHex( cmap[isovalue][1]) }
	}
     });
    }

    }else if(slice == 1){
    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.VertexColors;					    
    material.side = THREE.DoubleSide;
    }

    return new THREE.Mesh( geometry, material );


    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;

        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];

        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }

        return index;
    }
    
    function table_slice_index( x, y, z )
    {
        var s0 = plane_function( x,     y,     z     );
        var s1 = plane_function( x + 1, y,     z     );
        var s2 = plane_function( x + 1, y + 1, z     );
        var s3 = plane_function( x,     y + 1, z     );
        var s4 = plane_function( x,     y,     z + 1 );
        var s5 = plane_function( x + 1, y,     z + 1 );
        var s6 = plane_function( x + 1, y + 1, z + 1 );
        var s7 = plane_function( x,     y + 1, z + 1 );

        var index = 0;
        if ( s0 > 0 ) { index |=   1; }
        if ( s1 > 0 ) { index |=   2; }
        if ( s2 > 0 ) { index |=   4; }
        if ( s3 > 0 ) { index |=   8; }
        if ( s4 > 0 ) { index |=  16; }
        if ( s5 > 0 ) { index |=  32; }
        if ( s6 > 0 ) { index |=  64; }
        if ( s7 > 0 ) { index |= 128; }

        return index;
    }
    
    function plane_function( x, y, z )
    {
        return coef.x * x + coef.y * y + coef.z * z + coef.w;
    }    
    function interpolated_vertex( v0, v1, s )
    {
        var lines = volume.resolution.x;
	var slices = volume.resolution.x * volume.resolution.y;
	var s0 = volume.values[(v0.z*slices) + (v0.y*lines) + v0.x][0];
	var s1 = volume.values[(v1.z*slices) + (v1.y*lines) + v1.x][0];
	var v = new THREE.Vector3(v1.x - v0.x, v1.y-v0.y, v1.z-v0.z );
	var temp;

	if( s0 < s1 ){
	    temp = (s - s0)/(s1 - s0);
	}else{
	    temp =  1 - (s - s1)/(s0 - s1);
	}
	v.x = v0.x + v.x*temp;
	v.y = v0.y + v.y*temp;
	v.z = v0.z + v.z*temp;
	return v;
    }

    function interpolated_slice_vertex( v0, v1){
	if( v0.x != v1.x ){
	    var s0 = v0.x;
	    var s1 = v1.x;
	    var s =  (-coef.y * v0.y - coef.z * v0.z -coef.w) / coef.x;
	    return new THREE.Vector3( s , v0.y , v0.z );
	}
	if( v0.y != v1.y ){
	    var s0 = v0.y;
	    var s1 = v1.y;
	    var s =   (-coef.x * v0.x - coef.z * v0.z -coef.w) / coef.y;
	    return new THREE.Vector3( v0.x , s , v0.z );
	}
	if( v0.z != v1.z ){
	    var s0 = v0.z;
	    var s1 = v1.z;
	    var s =  (-coef.x * v0.x - coef.y * v0.y -coef.w) / coef.z;
	    return new THREE.Vector3( v0.x , v0.y , s );
	}
    }

   function interpolated_slice_value( v0, v1 )
    {
       /* var s0 = plane_function( v0.x, v0.y, v0.z );
        var s1 = plane_function( v1.x, v1.y, v1.z );
        var a = Math.abs( s0 / ( s1 - s0 ) );*/

        var id0 = index_of( v0 );
        var id1 = index_of( v1 );

	var s0  = volume.values[id0][0];
	var s1  = volume.values[id1][0];
	var v01 = interpolated_slice_vertex( v0 , v1 );

	if( v0.x != v1.x){
	    var p = ( 2*v01.x - ( v0.x + v1.x ) )/( v1.x - v0.x );
	    var s01 = ( s1 - s0 )*p/2 + ( s0 + s1 )/2;
	}

	if( v0.y != v1.y){
	    var p = ( 2*v01.y - ( v0.y + v1.y ) )/( v1.y - v0.y );
	    var s01 = ( s1 - s0 )*p/2 + ( s0 + s1 )/2;
	}

	if( v0.z != v1.z){
	    var p = ( 2*v01.z - ( v0.z + v1.z ) )/( v1.z - v0.z );
	    var s01 = ( s1 - s0 )*p/2 + ( s0 + s1 )/2;
	}
	
	return  Math.round( s01 );

        function index_of( v )
        {
            var lines = volume.resolution.x;
            var slices = volume.resolution.x * volume.resolution.y;
            return Math.floor( v.x + v.y * lines + v.z * slices );
        }
    }
    
}
