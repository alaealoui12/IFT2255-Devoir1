package com.diro.ift2255.service;

import com.diro.ift2255.model.Avis;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class AvisService implements IService<Avis> {

    private final String filePath;
    private final ObjectMapper mapper = new ObjectMapper();

    // ==========================
    // CONSTRUCTEURS
    // ==========================

    // 👉 PRODUCTION
    public AvisService() {
        this.filePath = "data/avis.json";
    }

    // 👉 TESTS (injection du fichier)
    public AvisService(String filePath) {
        this.filePath = filePath;
    }

    // ==========================
    // MÉTHODES MÉTIER
    // ==========================

    public List<Avis> lireAvis() {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                return new ArrayList<>();
            }
            return mapper.readValue(file, new TypeReference<List<Avis>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Avis> getByCourse(String courseId) {
        return lireAvis().stream()
                .filter(a -> a.getCours().equalsIgnoreCase(courseId))
                .toList();
    }

    public void ajouterAvis(Avis avis) {
        List<Avis> avisList = lireAvis();
        avisList.add(avis);
        try {
            mapper.writerWithDefaultPrettyPrinter()
                  .writeValue(new File(filePath), avisList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ==========================
    // MÉTHODES INTERFACE IService
    // ==========================

    @Override
    public List<Avis> getAll() {
        return lireAvis();
    }

    @Override
    public Avis getById(String id) {
        return null;
    }

    @Override
    public void create(Avis avis) {
        ajouterAvis(avis);
    }

    @Override
    public void update(String id, Avis avis) {
        throw new UnsupportedOperationException("Avis cannot be updated.");
    }

    @Override
    public void delete(String id) {
        throw new UnsupportedOperationException("Avis cannot be deleted.");
    }
}