/**
 * @author mrdoob / http://mrdoob.com/
 */
import {DefaultLoadingManager, Object3D, LoadingManager, Material as ThreeMaterial, FileLoader, Group, BufferAttribute, BufferGeometry, FlatShading, SmoothShading, MeshPhongMaterial, LineBasicMaterial, LineSegments, Mesh, MultiMaterial} from 'three';

class Material {
    index:number = 0;
    name:string = '';
    mtllib:string = '';
    smooth:boolean = false;
    groupStart:number = 0;
    groupEnd:number = -1;
    groupCount:number = -1;
    inherited:boolean = false;

    constructor(index:number, name:string, mtllib:string, smooth:boolean, groupStart?:number) {
        this.index = index;
        this.name = name;
        this.mtllib = mtllib;
        this.smooth = smooth;
        if (groupStart) this.groupStart = groupStart;
    }

    clone( index:number ):Material {
        return new Material(
            ( typeof index === 'number' ? index : this.index ),
            this.name,
            this.mtllib,
            this.smooth
        );
    };
}

class Object {
    name:string = '';
    fromDeclaration:boolean = false;

    geometry:any = {
        vertices : [],
        normals  : [],
        uvs      : []
    };
    materials:Material[] = [];
    smooth:boolean = true;

    constructor(name:string, fromDeclaration:boolean) {
        this.name = name;
        this.fromDeclaration = fromDeclaration;
    }

    startMaterial( name:string, libraries:string[] ):Material {
        let previous = this.finalize( false );

        // New usemtl declaration overwrites an inherited material, except if faces were declared
        // after the material, then it must be preserved for proper MultiMaterial continuation.
        if ( previous && ( previous.inherited || previous.groupCount <= 0 ) ) {
            this.materials.splice( previous.index, 1 );
        }

        let material:Material = new Material(
            this.materials.length,
            this.name,
            ( Array.isArray( libraries ) && libraries.length > 0 ? libraries[ libraries.length - 1 ] : '' ),
            ( previous !== undefined ? previous.smooth : this.smooth ),
            ( previous !== undefined ? previous.groupEnd : 0 )
        );

        this.materials.push( material );

        return material;
    }

    currentMaterial():Material {
        if ( this.materials.length > 0 ) {
            return this.materials[ this.materials.length - 1 ];
        }

        return undefined;
    };

    finalize( end:boolean):Material {
        let lastMultiMaterial = this.currentMaterial();
        if ( lastMultiMaterial && lastMultiMaterial.groupEnd === -1 ) {
            lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
            lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
            lastMultiMaterial.inherited = false;
        }

        // Ignore objects tail materials if no face declarations followed them before a new o/g started.
        if ( end && this.materials.length > 1 ) {
            for ( let mi = this.materials.length - 1; mi >= 0; mi-- ) {
                if ( this.materials[mi].groupCount <= 0 ) {
                    this.materials.splice( mi, 1 );
                }
            }
        }

        // Guarantee at least one empty material, this makes the creation later more straight forward.
        if ( end && this.materials.length === 0 ) {
            this.materials.push(new Material(
                0,
                '',
                '',
                this.smooth
            ));
        }

        return lastMultiMaterial;
    }
}

class ParserState {
    objects:any[] = [];
    object:Object;

    vertices:any = [];
    normals:any  = [];
    uvs:any      = [];

    materialLibraries:string[] = [];

    startObject( name:string, fromDeclaration?:boolean ) {
        // If the current object (initial from reset) is not from a g/o declaration in the parsed
        // file. We need to use it for the first parsed g/o to keep things in sync.
        if ( this.object && this.object.fromDeclaration === false ) {
            this.object.name = name;
            this.object.fromDeclaration = ( fromDeclaration !== false );
            return;
        }

        let previousMaterial = ( this.object ? this.object.currentMaterial() : undefined );

        if ( this.object && typeof this.object.finalize === 'function' ) {
            this.object.finalize( true );
        }

        this.object = new Object(name, fromDeclaration);

        // Inherit previous objects material.
        // Spec tells us that a declared material must be set to all objects until a new material is declared.
        // If a usemtl declaration is encountered while this new object is being parsed, it will
        // overwrite the inherited material. Exception being that there was already face declarations
        // to the inherited material, then it will be preserved for proper MultiMaterial continuation.

        if ( previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function" ) {
            let declared = previousMaterial.clone( 0 );
            declared.inherited = true;
            this.object.materials.push( declared );
        }

        this.objects.push( this.object );
    }

    finalize() {

        if ( this.object && typeof this.object.finalize === 'function' ) {

            this.object.finalize( true );

        }

    }

    parseVertexIndex( value:any, len:number ) {

        let index = parseInt( value, 10 );
        return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

    }

    parseNormalIndex( value:any, len:number ) {

        let index = parseInt( value, 10 );
        return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

    }

    parseUVIndex( value:any, len:number ) {

        let index = parseInt( value, 10 );
        return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

    }

    addVertex( a:any, b:any, c:any ) {

        let src = this.vertices;
        let dst = this.object.geometry.vertices;

        dst.push( src[ a + 0 ] );
        dst.push( src[ a + 1 ] );
        dst.push( src[ a + 2 ] );
        dst.push( src[ b + 0 ] );
        dst.push( src[ b + 1 ] );
        dst.push( src[ b + 2 ] );
        dst.push( src[ c + 0 ] );
        dst.push( src[ c + 1 ] );
        dst.push( src[ c + 2 ] );

    }

    addVertexLine( a:any ) {

        let src = this.vertices;
        let dst = this.object.geometry.vertices;

        dst.push( src[ a + 0 ] );
        dst.push( src[ a + 1 ] );
        dst.push( src[ a + 2 ] );

    }

    addNormal ( a:any, b:any, c:any ) {

        let src = this.normals;
        let dst = this.object.geometry.normals;

        dst.push( src[ a + 0 ] );
        dst.push( src[ a + 1 ] );
        dst.push( src[ a + 2 ] );
        dst.push( src[ b + 0 ] );
        dst.push( src[ b + 1 ] );
        dst.push( src[ b + 2 ] );
        dst.push( src[ c + 0 ] );
        dst.push( src[ c + 1 ] );
        dst.push( src[ c + 2 ] );

    }

    addUV ( a:any, b:any, c:any ) {

        let src = this.uvs;
        let dst = this.object.geometry.uvs;

        dst.push( src[ a + 0 ] );
        dst.push( src[ a + 1 ] );
        dst.push( src[ b + 0 ] );
        dst.push( src[ b + 1 ] );
        dst.push( src[ c + 0 ] );
        dst.push( src[ c + 1 ] );

    }

    addUVLine ( a:any ) {

        let src = this.uvs;
        let dst = this.object.geometry.uvs;

        dst.push( src[ a + 0 ] );
        dst.push( src[ a + 1 ] );

    }

    addFace ( a:any, b:any, c:any, d?:any, ua?:any, ub?:any, uc?:any, ud?:any, na?:any, nb?:any, nc?:any, nd?:any ) {

        let vLen = this.vertices.length;

        let ia = this.parseVertexIndex( a, vLen );
        let ib = this.parseVertexIndex( b, vLen );
        let ic = this.parseVertexIndex( c, vLen );
        let id = 0;

        if ( d === undefined ) {

            this.addVertex( ia, ib, ic );

        } else {

            id = this.parseVertexIndex( d, vLen );

            this.addVertex( ia, ib, id );
            this.addVertex( ib, ic, id );

        }

        if ( ua !== undefined ) {

            let uvLen = this.uvs.length;

            ia = this.parseUVIndex( ua, uvLen );
            ib = this.parseUVIndex( ub, uvLen );
            ic = this.parseUVIndex( uc, uvLen );

            if ( d === undefined ) {

                this.addUV( ia, ib, ic );

            } else {

                id = this.parseUVIndex( ud, uvLen );

                this.addUV( ia, ib, id );
                this.addUV( ib, ic, id );

            }

        }

        if ( na !== undefined ) {

            // Normals are many times the same. If so, skip function call and parseInt.
            let nLen = this.normals.length;
            ia = this.parseNormalIndex( na, nLen );

            ib = na === nb ? ia : this.parseNormalIndex( nb, nLen );
            ic = na === nc ? ia : this.parseNormalIndex( nc, nLen );

            if ( d === undefined ) {

                this.addNormal( ia, ib, ic );

            } else {

                id = this.parseNormalIndex( nd, nLen );

                this.addNormal( ia, ib, id );
                this.addNormal( ib, ic, id );

            }

        }

    }

    addLineGeometry ( vertices:any[], uvs:any[] ) {

        this.object.geometry.type = 'Line';

        let vLen = this.vertices.length;
        let uvLen = this.uvs.length;

        for ( let vi = 0, l = vertices.length; vi < l; vi ++ ) {

            this.addVertexLine( this.parseVertexIndex( vertices[ vi ], vLen ) );

        }

        for ( let uvi = 0, l = uvs.length; uvi < l; uvi ++ ) {

            this.addUVLine( this.parseUVIndex( uvs[ uvi ], uvLen ) );

        }

    }
}

export class OBJLoader {
    manager:LoadingManager = DefaultLoadingManager;

	materials: ThreeMaterial[] = [];

	private regexp = {
		// v float float float
		vertex_pattern           : /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vn float float float
		normal_pattern           : /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vt float float
		uv_pattern               : /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// f vertex vertex vertex
		face_vertex              : /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
		// f vertex/uv vertex/uv vertex/uv
		face_vertex_uv           : /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
		face_vertex_uv_normal    : /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
		// f vertex//normal vertex//normal vertex//normal
		face_vertex_normal       : /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
		// o object_name | g group_name
		object_pattern           : /^[og]\s*(.+)?/,
		// s boolean
		smoothing_pattern        : /^s\s+(\d+|on|off)/,
		// mtllib file_reference
		material_library_pattern : /^mtllib /,
		// usemtl material_name
		material_use_pattern     : /^usemtl /
	};

	private path: string;

    constructor(manager?:LoadingManager) {
        if (manager) {
            this.manager = manager;
        }
    }

	load( url:string, material:ThreeMaterial, onLoad:(object:Object3D) => void, onProgress?:(request: ProgressEvent) => void, onError?:(event: ErrorEvent) => void ) {
		let scope = this;

		let loader = new FileLoader( scope.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text, material ) );

		}, onProgress, onError );
	}

	setPath( value:string ) {
		this.path = value;
	}

	setMaterials( materials:ThreeMaterial[] ) {
		this.materials = materials;
	}

	private createParserState(): ParserState {
		let state:ParserState = new ParserState();

		state.startObject( '', false );

		return state;
	}

	parse(text:string, incomingMaterial:ThreeMaterial):Object3D {
		console.time( 'OBJLoader' );

		let state:ParserState = this.createParserState();

		if ( text.indexOf( '\r\n' ) !== - 1 ) {
			// This is faster than String.split with regex that splits on both
			text = text.replace( /\r\n/g, '\n' );
		}

		if ( text.indexOf( '\\\n' ) !== - 1) {
			// join lines separated by a line continuation character (\)
			text = text.replace( /\\\n/g, '' );
		}

		let lines:string[] = text.split( '\n' );
		let line:string = '', lineFirstChar:string = '', lineSecondChar:string = '';
		let lineLength:number = 0;
		let result:RegExpExecArray = null;

		for ( let i = 0, l = lines.length; i < l; i ++ ) {
			line = lines[ i ];

			line = line.trim();

			lineLength = line.length;

			if ( lineLength === 0 ) continue;

			lineFirstChar = line.charAt( 0 );

			if ( lineFirstChar === '#' ) continue;

			if ( lineFirstChar === 'v' ) {
				lineSecondChar = line.charAt( 1 );

				if ( lineSecondChar === ' ' && ( result = this.regexp.vertex_pattern.exec( line ) ) !== null ) {
					// 0                  1      2      3
					// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.vertices.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);
				} else if ( lineSecondChar === 'n' && ( result = this.regexp.normal_pattern.exec( line ) ) !== null ) {
					// 0                   1      2      3
					// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.normals.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);
				} else if ( lineSecondChar === 't' && ( result = this.regexp.uv_pattern.exec( line ) ) !== null ) {
					// 0               1      2
					// ["vt 0.1 0.2", "0.1", "0.2"]

					state.uvs.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] )
					);
				} else {
					throw new Error( "Unexpected vertex/normal/uv line: '" + line  + "'" );
				}
			} else if ( lineFirstChar === "f" ) {
				if ( ( result = this.regexp.face_vertex_uv_normal.exec( line ) ) !== null ) {
					// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
					// 0                        1    2    3    4    5    6    7    8    9   10         11         12
					// ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 4 ], result[ 7 ], result[ 10 ],
						result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
						result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
					);
				} else if ( ( result = this.regexp.face_vertex_uv.exec( line ) ) !== null ) {

					// f vertex/uv vertex/uv vertex/uv
					// 0                  1    2    3    4    5    6   7          8
					// ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]
					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);
				} else if ( ( result = this.regexp.face_vertex_normal.exec( line ) ) !== null ) {
					// f vertex//normal vertex//normal vertex//normal
					// 0                     1    2    3    4    5    6   7          8
					// ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						undefined, undefined, undefined, undefined,
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);
				} else if ( ( result = this.regexp.face_vertex.exec( line ) ) !== null ) {
					// f vertex vertex vertex
					// 0            1    2    3   4
					// ["f 1 2 3", "1", "2", "3", undefined]

					state.addFace(
						result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
					);
				} else {
					throw new Error( "Unexpected face line: '" + line  + "'" );
				}
			} else if ( lineFirstChar === "l" ) {
				let lineParts = line.substring( 1 ).trim().split( " " );
				let lineVertices:string[] = [], lineUVs:string[] = [];

				if ( line.indexOf( "/" ) === - 1 ) {
					lineVertices = lineParts;
				} else {
					for ( let li = 0, llen = lineParts.length; li < llen; li ++ ) {
						let parts = lineParts[ li ].split( "/" );

						if ( parts[ 0 ] !== "" ) lineVertices.push( parts[ 0 ] );
						if ( parts[ 1 ] !== "" ) lineUVs.push( parts[ 1 ] );
					}
				}
				state.addLineGeometry( lineVertices, lineUVs );
			} else if ( ( result = this.regexp.object_pattern.exec( line ) ) !== null ) {
				// o object_name
				// or
				// g group_name

				// WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
				// let name = result[ 0 ].substr( 1 ).trim();
				let name = ( " " + result[ 0 ].substr( 1 ).trim() ).substr( 1 );

				state.startObject( name );
			} else if ( this.regexp.material_use_pattern.test( line ) ) {
				// material

				state.object.startMaterial( line.substring( 7 ).trim(), state.materialLibraries );
			} else if ( this.regexp.material_library_pattern.test( line ) ) {
				// mtl file

				state.materialLibraries.push( line.substring( 7 ).trim() );
			} else if ( ( result = this.regexp.smoothing_pattern.exec( line ) ) !== null ) {
				// smooth shading

				let value = result[ 1 ].trim().toLowerCase();
				state.object.smooth = ( value === '1' || value === 'on' );

				let material = state.object.currentMaterial();
				if ( material ) {
					material.smooth = state.object.smooth;
				}
			} else {
				// Handle null terminated files without exception
				if ( line === '\0' ) continue;

				throw new Error( "Unexpected line: '" + line  + "'" );
			}
		}

		state.finalize();

		let container = new Group();
		//container.materialLibraries = [].concat( state.materialLibraries );

		for ( let i = 0, l = state.objects.length; i < l; i ++ ) {
			let object = state.objects[ i ];
			let geometry = object.geometry;
			let materials = object.materials;
			let isLine = ( geometry.type === 'Line' );

			// Skip o/g line declarations that did not follow with any faces
			if ( geometry.vertices.length === 0 ) continue;

			let buffergeometry = new BufferGeometry();

			buffergeometry.addAttribute( 'position', new BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

			if ( geometry.normals.length > 0 ) {
				buffergeometry.addAttribute( 'normal', new BufferAttribute( new Float32Array( geometry.normals ), 3 ) );
			} else {
				buffergeometry.computeVertexNormals();
			}

			if ( geometry.uvs.length > 0 ) {
				buffergeometry.addAttribute( 'uv', new BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );
			}

			// Create materials

			let createdMaterials:ThreeMaterial[] = [];

			for ( let mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {
				let sourceMaterial = materials[mi];
				let material:ThreeMaterial = undefined;

				if ( this.materials !== null ) {
					/*material = this.materials.create( sourceMaterial.name );

					// mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
					if ( isLine && material && ! ( material instanceof LineBasicMaterial ) ) {
						let materialLine = new LineBasicMaterial();
						materialLine.copy( material );
						material = materialLine;
					}*/
				}

				if ( ! material ) {
					material = ( ! isLine ? new MeshPhongMaterial() : new LineBasicMaterial() );
					material.name = sourceMaterial.name;
				}

				material.shading = sourceMaterial.smooth ? SmoothShading : FlatShading;

				createdMaterials.push(material);
			}

			// Create mesh

			let mesh:Object3D;

			if ( createdMaterials.length > 1 ) {
				for ( let mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {
					let sourceMaterial = materials[mi];
					buffergeometry.addGroup( sourceMaterial.groupStart, sourceMaterial.groupCount, mi );
				}

				let multiMaterial = new MultiMaterial( createdMaterials );
				mesh = ( ! isLine ? new Mesh( buffergeometry, multiMaterial ) : new LineSegments( buffergeometry ) );
			} else {
				//mesh = ( ! isLine ? new Mesh( buffergeometry, createdMaterials[ 0 ] ) : new LineSegments( buffergeometry ) );

                mesh = new Mesh(buffergeometry, incomingMaterial);
			}

			mesh.name = object.name;

			container.add( mesh );
		}

		console.timeEnd( 'OBJLoader' );

		return container;
	}
}