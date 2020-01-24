////////////////////////////////////////////
//Collider Code From Custom 2D OpenGL Engine
////////////////////////////////////////////
#include "Collider.h"
#include <iostream>


using namespace std;
Collider::Collider(float posx, float posy, float ox, float oy,int t)
{
	left = posx - ox;
	right = posx + ox;
	up = posy + oy;
	down = posy - oy;
	offx = ox;
	offy = oy;
	type = t;

}

void Collider::update(float posx, float posy)
{
	left = posx - offx;
	right = posx + offx;
	up = posy + offy;
	down = posy - offy;

}

float Collider::getLeft()
{
	return left;
}

float Collider::getRight()
{
	return right;
}

float Collider::getUp()
{
	return up;
}

float Collider::getDown()
{
	return down;
}

float Collider::getposx()
{
	return posx;
}

float Collider::getposy()
{
	return posy;
}

float Collider::getoffx()
{
	return offx;
}

float Collider::getoffy()
{
	return offy;
}

int Collider::gettype()
{
	return type;
}

bool Collider::checkcollision(Collider * other)
{

	bool coll = true;
	if (getLeft() > other->getRight())
	{
		coll = false;
	}
	if (getDown() > other->getUp())
	{
		coll = false;
	}
	if (getRight() < other->getLeft())
	{
		coll = false;
	}
	if (getUp() < other->getDown())
	{
		coll = false;
	}
	return coll;

}
