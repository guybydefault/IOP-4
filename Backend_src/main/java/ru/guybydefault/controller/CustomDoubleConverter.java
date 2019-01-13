package ru.guybydefault.controller;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.TypeDescriptor;

public class CustomDoubleConverter extends StdConverter<String, Double> {

    @Override
    public Double convert(String str) {
        if (str.length() > 15) {
            throw new ConversionFailedException(TypeDescriptor.forObject(str), TypeDescriptor.valueOf(Double.class), str, new Throwable("Length of double exceeds the limit."));
        }

        double value;
        try {
            value = Double.parseDouble(str);
        } catch (NumberFormatException e) {
            throw new ConversionFailedException(TypeDescriptor.forObject(str), TypeDescriptor.valueOf(Double.class), str, new Throwable("Is not a double."));
        }
        return value;
    }
}
