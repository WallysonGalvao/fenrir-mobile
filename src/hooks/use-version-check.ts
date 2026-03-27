/**
 * Version Check Hook
 * Checks for app updates using react-native-version-check
 *
 * Features:
 * - Checks App Store/Play Store for newer versions
 * - Supports optional and forced updates
 * - Configurable via remote config or API
 */

import { useCallback, useEffect, useState } from 'react';

import { createMMKV } from 'react-native-mmkv';
import VersionCheck from 'react-native-version-check';

import { Linking, Platform } from 'react-native';

// import { AnalyticsEvents } from '@/analytics/events';
import { ONE_DAY_IN_MS } from '@/constants/time';

const versionCheckStorage = createMMKV({ id: 'version-check' });
const LAST_CHECK_KEY = 'lastVersionCheckAt';

function computeNeedsUpdate(
  latestVersion: string | null,
  currentVersion: string,
  minimumVersion: string | undefined,
  compareVersions: (v1: string, v2: string) => number,
): boolean {
  if (!latestVersion) return false;
  const comparison = compareVersions(latestVersion, currentVersion);
  const needsUpdate = comparison > 0;
  if (minimumVersion && !needsUpdate) {
    return compareVersions(minimumVersion, currentVersion) > 0;
  }
  return needsUpdate;
}

function safeStoreUrl(url: string | null | undefined): string {
  return url || '';
}

function latestVersionOrUnknown(v: string | null | undefined): string {
  return v || 'unknown';
}

function getVersionErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Version check failed';
}

interface FetchVersionResult {
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
  needsUpdate: boolean;
}

async function fetchVersionInfo(
  minimumVersion: string | undefined,
  compareVersions: (v1: string, v2: string) => number,
): Promise<FetchVersionResult | null> {
  try {
    const latestVersion = await VersionCheck.getLatestVersion({
      provider: Platform.select({
        ios: 'appStore',
        android: 'playStore',
      }) as 'appStore' | 'playStore',
    });

    const rawStoreUrl = await VersionCheck.getStoreUrl({
      appID: Platform.select({
        ios: '6759005140',
        android: 'com.wgsoftwares.wakemind',
      }),
    });

    const currentVersion = VersionCheck.getCurrentVersion();
    const storeUrl = safeStoreUrl(rawStoreUrl);
    const needsUpdate = computeNeedsUpdate(
      latestVersion,
      currentVersion,
      minimumVersion,
      compareVersions,
    );

    return { currentVersion, latestVersion, storeUrl, needsUpdate };
  } catch (error) {
    console.warn('[VersionCheck] Error (non-critical):', getVersionErrorMessage(error));
    return null;
  }
}

async function openStoreUrl(storeUrl: string, currentVersion: string): Promise<void> {
  try {
    const url = storeUrl || (await VersionCheck.getStoreUrl());
    if (url) {
      // AnalyticsEvents.updateInitiated(currentVersion);
      await Linking.openURL(url);
    } else {
      console.warn('[VersionCheck] Store URL not available');
    }
  } catch (error) {
    console.error('[VersionCheck] Error opening store:', error);
  }
}

interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  storeUrl: string;
  needsUpdate: boolean;
  isLoading: boolean;
  error: string | null;
}

interface VersionCheckConfig {
  /**
   * If true, app will be blocked until user updates
   */
  forceUpdate?: boolean;
  /**
   * Minimum version required (if set, versions below will be forced to update)
   */
  minimumVersion?: string;
  /**
   * Check automatically on mount
   */
  autoCheck?: boolean;
}

/* eslint-disable react-you-might-not-need-an-effect/no-derived-state */
export function useVersionCheck(config: VersionCheckConfig = {}) {
  const { forceUpdate = false, minimumVersion, autoCheck = true } = config;

  const currentAppVersion = __DEV__ ? '0.0.0' : VersionCheck.getCurrentVersion();

  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    currentVersion: currentAppVersion,
    latestVersion: null,
    storeUrl: '',
    needsUpdate: false,
    isLoading: false,
    error: null,
  });

  /**
   * Compare versions (simple semantic version comparison)
   */
  const compareVersions = useCallback((v1: string, v2: string): number => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }, []);

  /**
   * Check for updates
   */
  const checkVersion = useCallback(async () => {
    // Skip version check in DEV mode or simulator
    if (__DEV__) {
      setVersionInfo((prev) => ({
        ...prev,
        isLoading: false,
        needsUpdate: false,
      }));
      return { needsUpdate: false, latestVersion: null, storeUrl: '' };
    }

    // Throttle: skip if checked within the last 24 hours
    const lastCheck = versionCheckStorage.getNumber(LAST_CHECK_KEY);
    if (lastCheck && Date.now() - lastCheck < ONE_DAY_IN_MS) {
      return { needsUpdate: false, latestVersion: null, storeUrl: '' };
    }

    setVersionInfo((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await fetchVersionInfo(minimumVersion, compareVersions);
    if (!result) {
      // Don't show error to user - version check is not critical
      setVersionInfo((prev) => ({
        ...prev,
        isLoading: false,
        needsUpdate: false,
        error: null,
      }));
      return { needsUpdate: false, latestVersion: null, storeUrl: '' };
    }

    const { currentVersion, latestVersion, storeUrl, needsUpdate } = result;

    setVersionInfo({
      currentVersion,
      latestVersion,
      storeUrl,
      needsUpdate,
      isLoading: false,
      error: null,
    });

    // Track analytics
    if (needsUpdate) {
      // AnalyticsEvents.updateAvailable(currentVersion, latestVersionOrUnknown(latestVersion));
    }

    versionCheckStorage.set(LAST_CHECK_KEY, Date.now());

    return { needsUpdate, latestVersion, storeUrl };
  }, [compareVersions, minimumVersion]);

  /**
   * Open app store page
   */
  const openStore = useCallback(async () => {
    await openStoreUrl(versionInfo.storeUrl, versionInfo.currentVersion);
  }, [versionInfo.storeUrl, versionInfo.currentVersion]);

  /**
   * Check if force update is required
   */
  const isForceUpdate = useCallback((): boolean => {
    if (forceUpdate && versionInfo.needsUpdate) {
      return true;
    }

    if (minimumVersion && versionInfo.currentVersion) {
      return compareVersions(minimumVersion, versionInfo.currentVersion) > 0;
    }

    return false;
  }, [
    forceUpdate,
    minimumVersion,
    versionInfo.needsUpdate,
    versionInfo.currentVersion,
    compareVersions,
  ]);

  /**
   * Auto-check on mount
   */
  useEffect(() => {
    if (autoCheck) {
      checkVersion();
    }
  }, [autoCheck, checkVersion]);

  return {
    ...versionInfo,
    checkVersion,
    openStore,
    isForceUpdate: isForceUpdate(),
  };
}
