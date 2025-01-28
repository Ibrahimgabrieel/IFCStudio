import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../core";
import { FragmentsManager } from "@thatopen/components";

export class FragmentService {
  private components: Components;
  private fragmentManager: FragmentsManager;

  constructor(components: Components) {
    this.components = components;
    this.fragmentManager = components.get(FragmentsManager);
  }

  /**
   * Change color of specific fragments
   * @param items FragmentIdMap containing fragment IDs and express IDs
   * @param color Color to apply
   * @param override Whether to override existing color
   */
  changeColor(
    items: FRAGS.FragmentIdMap, 
    color: THREE.Color, 
    override = false
  ) {
    for (const fragID in items) {
      const fragment = this.fragmentManager.list.get(fragID);
      if (!fragment) continue;
      
      const ids = items[fragID];
      fragment.setColor(color, ids, override);
    }
  }

  /**
   * Scale fragments
   * @param items FragmentIdMap containing fragment IDs and express IDs
   * @param scale Scale vector (x, y, z)
   */
  scaleFragments(
    items: FRAGS.FragmentIdMap, 
    scale: number
  ) {
    for (const fragID in items) {
      const fragment = this.fragmentManager.list.get(fragID);
      if (!fragment) continue;
      
      const ids = items[fragID];
      
      // Handle both vector and uniform scaling
      const scaleMatrix = typeof scale === 'number'
        ? new THREE.Matrix4().makeScale(scale, scale, scale)
        : new THREE.Matrix4().makeScale(scale, scale, scale);
      
      fragment.applyTransform(ids, scaleMatrix);
    }
  }

  /**
   * Translate/Move fragments
   * @param items FragmentIdMap containing fragment IDs and express IDs
   * @param translation Translation vector
   */
  moveFragments(
    items: FRAGS.FragmentIdMap, 
    translation: THREE.Vector3
  ) {
    for (const fragID in items) {
      const fragment = this.fragmentManager.list.get(fragID);
      if (!fragment) continue;
      
      const ids = items[fragID];
      
      const translationMatrix = new THREE.Matrix4().makeTranslation(
        translation.x, 
        translation.y, 
        translation.z
      );
      
      fragment.applyTransform(ids, translationMatrix);
    }
  }

  /**
   * Reset fragment colors to original
   * @param items FragmentIdMap containing fragment IDs and express IDs
   */
  resetColors(items: FRAGS.FragmentIdMap) {
    for (const fragID in items) {
      const fragment = this.fragmentManager.list.get(fragID);
      if (!fragment) continue;
      
      const ids = items[fragID];
      fragment.resetColor(ids);
    }
  }

  /**
   * Get fragment by ID
   * @param fragID Fragment ID
   * @returns Fragment or undefined
   */
  getFragment(fragID: string) {
    return this.fragmentManager.list.get(fragID);
  }
}