"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useEditeurCVStore,
  type SectionEditeur,
} from "@/features/cv/stores/cv-editor.store";
import { CarteSection } from "@/features/cv/components/editor/carte-section";

/**
 * Enveloppe une CarteSection pour la rendre "sortable" via dnd-kit.
 * dnd-kit fournit les props nécessaires (transform, transition, listeners)
 * qu'on applique au conteneur et qu'on transmet à la poignée de drag.
 */
function SectionTriable({ section }: { section: SectionEditeur }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CarteSection
        section={section}
        poigneeDragProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function ListeSections() {
  const cv = useEditeurCVStore((etat) => etat.cv);
  const reordonnerSections = useEditeurCVStore((etat) => etat.reordonnerSections);

  // Le capteur "PointerSensor" avec une distance d'activation évite
  // qu'un simple clic (pour éditer un champ) soit interprété comme
  // le début d'un drag — il faut bouger d'au moins 8px avant que
  // dnd-kit ne considère que l'utilisateur veut glisser.
  const capteurs = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  if (!cv) return null;

  function gererFinDrag(evenement: DragEndEvent) {
    const { active, over } = evenement;

    if (!over || active.id === over.id || !cv) return;

    const ancienIndex = cv.sections.findIndex((s) => s.id === active.id);
    const nouvelIndex = cv.sections.findIndex((s) => s.id === over.id);

    const nouvelOrdre = arrayMove(cv.sections, ancienIndex, nouvelIndex);
    reordonnerSections(nouvelOrdre.map((s) => s.id));
  }

  return (
    <DndContext
      sensors={capteurs}
      collisionDetection={closestCenter}
      onDragEnd={gererFinDrag}
    >
      <SortableContext
        items={cv.sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {cv.sections.map((section) => (
            <SectionTriable key={section.id} section={section} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}