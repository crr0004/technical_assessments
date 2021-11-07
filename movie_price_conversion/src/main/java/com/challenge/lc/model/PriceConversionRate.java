package com.challenge.lc.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public class PriceConversionRate {
    //{"base":"USD","date":"2020-06-01","rates":{"CAD":"1.260046","AU":"1.44058","EUR":"0.806942","GBP":"0.719154"}}
    @JsonProperty("CAD")
    private double cad;

    @JsonProperty("AU")
    private double au;
    @JsonProperty("EUR")
    private double eur;
    @JsonProperty("GBP")
    private double gbp;

    public double getCad() {
        return cad;
    }

    public void setCad(double cad) {
        this.cad = cad;
    }

    public double getAu() {
        return au;
    }

    public void setAu(double au) {
        this.au = au;
    }

    public double getEur() {
        return eur;
    }

    public void setEur(double eur) {
        this.eur = eur;
    }

    public double getGbp() {
        return gbp;
    }

    public void setGbp(double gbp) {
        this.gbp = gbp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceConversionRate that = (PriceConversionRate) o;
        return Double.compare(that.cad, cad) == 0 && Double.compare(that.au, au) == 0 && Double.compare(that.eur, eur) == 0 && Double.compare(that.gbp, gbp) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(cad, au, eur, gbp);
    }
}
