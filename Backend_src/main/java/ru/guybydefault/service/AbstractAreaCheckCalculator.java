package ru.guybydefault.service;

import ru.guybydefault.controller.AreaCheckRequest;
import ru.guybydefault.entity.AreaCheckResult;

public abstract class AbstractAreaCheckCalculator {

    protected abstract boolean calculate(double x, double y, double r);

    public final AreaCheckResult getResult(double x, double y, double r) {
        return new AreaCheckResult(x, y, r, calculate(x, y, r));
    }
    public final AreaCheckResult getResult(AreaCheckRequest areaCheckRequest) {
        return getResult(areaCheckRequest.getX(), areaCheckRequest.getY(), areaCheckRequest.getR());
    }
}
