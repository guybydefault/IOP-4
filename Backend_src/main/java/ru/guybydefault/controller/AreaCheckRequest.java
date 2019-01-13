package ru.guybydefault.controller;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class AreaCheckRequest {
    @JsonDeserialize(converter = CustomDoubleConverter.class)
    private double x;
    @JsonDeserialize(converter = CustomDoubleConverter.class)
    private double y;
    @JsonDeserialize(converter = CustomDoubleConverter.class)
    public double r;

    public AreaCheckRequest() {
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double radius) {
        this.r = radius;
    }
}

