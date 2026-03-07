package com.diro.ift2255.controller;

import io.javalin.http.Context;
import com.diro.ift2255.model.Avis;
import com.diro.ift2255.service.AvisService;
import com.diro.ift2255.util.ResponseUtil;

/**
 * Contrôleur responsable de la gestion des avis étudiants.
 *
 * <p>
 * Ce contrôleur expose des endpoints REST permettant :
 * <ul>
 *   <li>d'ajouter un avis étudiant</li>
 *   <li>de consulter tous les avis</li>
 *   <li>de consulter les avis associés à un cours précis</li>
 * </ul>
 * </p>
 */
public class AvisController {

    /** Service gérant la logique métier liée aux avis */
    private final AvisService avisService;

    /**
     * Construit un contrôleur d'avis avec le service associé.
     *
     * @param avisService service de gestion des avis
     */
    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    /**
     * Ajoute un nouvel avis étudiant.
     *
     * <p>
     * Le corps de la requête doit contenir un objet {@link Avis}
     * sérialisé en JSON.
     * </p>
     *
     * <p>
     * En cas de succès, retourne l'avis ajouté avec le statut HTTP 201.
     * </p>
     *
     * @param ctx contexte HTTP Javalin
     */
    public void addAvis(Context ctx) {
        try {
            Avis avis = ctx.bodyAsClass(Avis.class);
            avisService.ajouterAvis(avis);
            ctx.status(201).json(avis);
        } catch (Exception e) {
            ctx.status(500).json(
                ResponseUtil.formatError(
                    "Erreur lors de l’ajout de l’avis : " + e.getMessage()
                )
            );
        }
    }

    /**
     * Récupère les avis associés à un cours donné.
     *
     * <p>
     * Le sigle du cours est fourni via le paramètre de chemin {@code course}.
     * </p>
     *
     * @param ctx contexte HTTP Javalin
     */
    public void getAvisByCourse(Context ctx) {
        String courseId = ctx.pathParam("course");
        ctx.json(avisService.getByCourse(courseId));
    }

    /**
     * Récupère l'ensemble des avis étudiants stockés.
     *
     * @param ctx contexte HTTP Javalin
     */
    public void getAllAvis(Context ctx) {
        ctx.json(avisService.lireAvis());
    }
}