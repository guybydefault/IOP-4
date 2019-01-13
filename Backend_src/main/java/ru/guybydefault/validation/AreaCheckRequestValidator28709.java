package ru.guybydefault.validation;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.guybydefault.controller.AreaCheckRequest;

import java.util.Arrays;
import java.util.List;

@Component(value = "areaCheckRequestValidator28709")
public class AreaCheckRequestValidator28709 implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return AreaCheckRequest.class.isAssignableFrom(clazz);
    }

    private List<Double> rAllowed = Arrays.asList(new Double[]{1d, 2d, 3d, 4d, 5d});

    @Override
    public void validate(Object obj, Errors errors) {
        AreaCheckRequest areaCheckRequest = (AreaCheckRequest) obj;
        if (!(areaCheckRequest.getX() >= -3 && areaCheckRequest.getX() <= 5)) {
            errors.rejectValue("x", "X не входит в рамки рассматриваемого диапазона");
            ;
        }
        if (!(areaCheckRequest.getY() < 3 && areaCheckRequest.getY() > -5)) {
            errors.rejectValue("y", "Y не входит в рамки рассматриваемого диапазона");
        }

        if (!rAllowed.stream().anyMatch((d -> (d.equals(areaCheckRequest.getR()))))) {
            StringBuilder rAllowedStringBuilder = new StringBuilder();
            rAllowed.iterator().forEachRemaining(d -> rAllowedStringBuilder.append(d.toString() + ", "));
            errors.rejectValue("r", "Radius должен принадлежать множеству " + rAllowedStringBuilder.toString());
        }
    }
}
