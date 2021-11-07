package com.challenge.lc.model;

import java.util.Objects;

public class PriceConversion {
    // {"base":"USD","date":"2020-06-01","rates":{"CAD":"1.260046","AU":"1.44058","EUR":"0.806942","GBP":"0.719154"}}
    private String base;
    private String date;
    private PriceConversionRate rates;

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public PriceConversionRate getRates() {
        return rates;
    }

    public void setRates(PriceConversionRate rates) {
        this.rates = rates;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceConversion that = (PriceConversion) o;
        return Objects.equals(base, that.base) && Objects.equals(date, that.date) && Objects.equals(rates, that.rates);
    }

    @Override
    public int hashCode() {
        return Objects.hash(base, date, rates);
    }
}
