/* Start Header -------------------------------------------------------
Purpose: The fragment shader for the object. Calculates the color for each fragment using normals,vertices,and light properties.Part of Phong Shading.
Language: GLSL
Platform: Windows 10
Creation date: 10/10/18
End Header --------------------------------------------------------*/




#version 430 core


in VS_OUT
{
    vec4 vertexNormal;
	vec4 vertexPosition;
    vec3 rasterColor;
	vec3 specColor;
	vec2 uv;
} fs_in;

// Output data
out vec3 color;

layout(std140) uniform LightArray
{
    vec3 LightPosition[16];
    vec3 LightAmbient[16];
    vec3 LightDiffuse[16];
    vec3 LightSpecular[16];
	vec3 ObjAmbient;
	vec3 LightAttenuation[16];
	float IsSpot[16];
	vec3 LightSpot[16];
	vec3 SpotDirection[16];
	int ActiveLights;
	vec3 FogColor;
	vec2 ClipDistance;
	vec3 ObjEmissive;
	vec3 GlobalAmbient;
	vec3 Maximum;
	vec3 Minimum;
} LA;


uniform mat4  MVP;
uniform mat4  M;
uniform mat4  V;
uniform mat4  P;
uniform bool isplane;
uniform bool calcuvincpu;
uniform int texturewrapmode;
uniform bool usenormals;
uniform sampler2D difftex;
uniform sampler2D spectex;


// Material values


vec3 Kd ;
vec3 Ks ;
vec3 Ka ;
vec3 Emiss;


void main()
{

 if(isplane)
 {
	Kd =fs_in.rasterColor;
	Ka = Kd*0.3;
	Ks = fs_in.specColor; 
	Emiss=vec3(0,0,0);
 }
 else
 {
 Ka=LA.ObjAmbient.rgb;
 Emiss=LA.ObjEmissive.rgb;
	  if(calcuvincpu)
	 {
		 Kd = texture( difftex, fs_in.uv ).rgb;
		 Ks = texture( spectex, fs_in.uv ).rgb; 
	 }
	 else
	 {
		if(usenormals)
		{
		float x, y, z, u, v, theta, phi, r;
			float lx, ly, lz;
			int s, t;
			if (texturewrapmode == 1)
			{
				
					x = (inverse(M)*fs_in.vertexNormal).x;
					y = (inverse(M)*fs_in.vertexNormal).y;
					z = (inverse(M)*fs_in.vertexNormal).z;
					lx = abs(x);
					ly = abs(y);
					lz = abs(z);
					if (lx >= ly && lx >= lz)
					{
						if (x >= 0)
						{
							u = -z / lx;
							v = y / lx;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = z / lx;
							v = y / lx;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					else if (ly >= lx && ly >= lz)
					{
						if (y >= 0)
						{
							u = x / ly;
							v = -z / ly;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = x / ly;
							v = z / ly;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					else if (lz >= ly && lz >= lx)
					{
						if (z >= 0)
						{
							u = x / lz;
							v = y / lz;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = -x / lz;
							v = y / lz;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					
				Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				
			}
			else if (texturewrapmode == 2)
			{
				
					x = (inverse(M)*fs_in.vertexNormal).x;
					y = (inverse(M)*fs_in.vertexNormal).y;
					z=(inverse(M)*fs_in.vertexNormal).z;
					theta = atan(z, x);
					u = theta / (2 * 3.14f);
				
					v = (y + 1.f) / 2.f;
				Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				
			}
			else
			{
			
						x = (inverse(M)*fs_in.vertexNormal).x;
					y = (inverse(M)*fs_in.vertexNormal).y;
					z=(inverse(M)*fs_in.vertexNormal).z;
					r = sqrt(x*x + y * y + z * z);
				
					phi = acos(y / r);

					theta = atan(z, x);

					u = theta / (2 * 3.14f);
					v = phi / 3.14f;
					Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				}
			
		 }
		 else
		 {
			float x, y, z, u, v, theta, phi, r;
			float lx, ly, lz;
			int s, t;
			if (texturewrapmode == 1)
			{
				
					x =( inverse(M)*fs_in.vertexPosition).x;
					y = ( inverse(M)*fs_in.vertexPosition).y;
					z= ( inverse(M)*fs_in.vertexPosition).z;
					lx = abs(x);
					ly = abs(y);
					lz = abs(z);
					if (lx >= ly && lx >= lz)
					{
						if (x >= 0)
						{
							u = -z / lx;
							v = y / lx;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = z / lx;
							v = y / lx;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					else if (ly >= lx && ly >= lz)
					{
						if (y >= 0)
						{
							u = x / ly;
							v = -z / ly;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = x / ly;
							v = z / ly;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					else if (lz >= ly && lz >= lx)
					{
						if (z >= 0)
						{
							u = x / lz;
							v = y / lz;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
						else
						{
							u = -x / lz;
							v = y / lz;
							u = (u + 1) / 2;
							v = (v + 1) / 2;
						}
					}
					
				Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				
			}
			else if (texturewrapmode == 2)
			{
				
					x = ( inverse(M)*fs_in.vertexPosition).x;
					y = ( inverse(M)*fs_in.vertexPosition).y;
					z= ( inverse(M)*fs_in.vertexPosition).z;
					theta = atan(z, x);
					u = theta / (2 * 3.14f);
					
					v = (y -LA.Minimum.y) / (LA.Maximum.y-LA.Minimum.y);
				Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				
			}
			else
			{
				
					x = ( inverse(M)*fs_in.vertexPosition).x;
					y =  ( inverse(M)*fs_in.vertexPosition).y;
					z=( inverse(M)*fs_in.vertexPosition).z;
					r = sqrt(x*x + y * y + z * z);
					phi = acos(y / r);

					theta = atan(z, x);

					u = theta / (2 * 3.14f);
					v = phi / 3.14f;
					Kd = texture( difftex, vec2(u,v) ).rgb;
				Ks = texture( spectex, vec2(u,v) ).rgb; 
				
			}
		 }
	 }
 }
 float ns = pow(Ks.r,2);
  vec3 finalColor = vec3(0.0f);
	  vec4 camPosition = vec4(3,3,-3,1.0);
	vec4 V = normalize(camPosition - fs_in.vertexPosition);
	float DV = length(camPosition - fs_in.vertexPosition);
  for(int i =0;i<LA.ActiveLights;i++)
  {
        // Ambient
        vec3 I_ambient = LA.LightAmbient[i] * Ka;
		




        // Diffuse
        vec4 light = vec4( LA.LightPosition[i], 1.0 );
	
        vec4 L = normalize(light - fs_in.vertexPosition);
		if(LA.IsSpot[i]==2)
			L = normalize(vec4(-LA.SpotDirection[i],0));
		float DL = length(light - fs_in.vertexPosition);
        float N_dot_L = max( dot(fs_in.vertexNormal, L ), 0.0f );
        vec3 I_diffuse = LA.LightDiffuse[i] * Ks * N_dot_L;
	




        // Specular 
		vec4 R = normalize(2*(dot(fs_in.vertexNormal,L))*fs_in.vertexNormal-L);
		 float R_dot_V=0;
		 if(N_dot_L>0)
		 {
		R_dot_V= max( dot(R,V),0);
		}
        vec3 I_specular = LA.LightSpecular[i] * Ks*pow(R_dot_V,ns);
	






        // Attenutation terms
	
		float att= min(1/(LA.LightAttenuation[i].x+LA.LightAttenuation[i].y*DL+LA.LightAttenuation[i].z*pow(DL,2)),1);


			//SpotLight
		float spot;
		
		
		if(LA.IsSpot[i]==1)
		{
			vec4 D = normalize(fs_in.vertexPosition-light);
	
			vec4 spotdirec=normalize(vec4(LA.SpotDirection[i],0.0));
		
			float theta = radians(LA.LightSpot[i].x);

			float phi = radians(LA.LightSpot[i].y);
		
			float P = LA.LightSpot[i].z;
			float alpha = acos(dot(spotdirec,D));
			if(dot(spotdirec,D)<cos(phi))
			{
				spot=0;
			}
				else if(dot(spotdirec,D)>cos(theta))
			{
				spot=1;
			}
			else
			{
				
				spot = pow((cos(alpha)-cos(phi))/(cos(theta)-cos(phi)),LA.LightSpot[i].z);
			}
		}
		else 
		{
			spot=1;
		}

        // Final color
        finalColor +=att*I_ambient+att*spot*( I_diffuse + I_specular);
	
		}
		finalColor+=(Emiss+Ka*LA.GlobalAmbient);
		float s =(LA.ClipDistance.y-DV)/(LA.ClipDistance.y-LA.ClipDistance.x);
	finalColor=s*finalColor+(1-s)*LA.FogColor;

   color =  finalColor;
   
}
