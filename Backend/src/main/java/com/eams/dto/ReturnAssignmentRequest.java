package com.eams.dto;

import java.time.LocalDate;

public class ReturnAssignmentRequest {

    private LocalDate returnDate;

    private String notes;

    public ReturnAssignmentRequest() {
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
