package ru.guybydefault.service;


import org.springframework.stereotype.Component;

@Component(value = "areaCheckCalulator28709")
public class AreaCheckCalculator28709 extends AbstractAreaCheckCalculator {
    protected boolean calculate(double x, double y, double r) {
        if (Math.abs(x) > r || Math.abs(y) > r) {
            return false;
        }

        if (x < 0) {
            return y <= 0 && y >= -Math.sqrt(r * r - x * x);
        } else {
            return (y >= 0 && y <= -x + r) || (y < 0 && x <= r / 2);
        }
    }
}
