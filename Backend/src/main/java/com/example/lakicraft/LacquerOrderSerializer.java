package com.example.lakicraft;

import com.example.lakicraft.model.LacquerOrder;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class LacquerOrderSerializer extends JsonSerializer<LacquerOrder> {
    @Override
    public void serialize(LacquerOrder value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("id", value.getId());
        gen.writeStringField("status", value.getStatus());
        // dodaj inne pola, które chcesz wysłać w JSON-ie
        gen.writeEndObject();
    }
}