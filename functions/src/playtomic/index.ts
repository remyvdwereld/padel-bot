import axios from "axios";
import {
  PLAYTOMIC_API_URL, PLAYTOMIC_API_TENANTS_PARAMS,
  FAVOURITE_TENANTS, PADEL_PREFERENCES, DISCORD_TIMEOUT_TIME,
} from "../config";
import { sendDiscordMessage } from "../sendDiscordMessage";
import type { Court, Tenant } from "./types";
import {
  createFormattedDate, createHyperlink, createTimeRange, getDates, DateObject,
} from "./utils";

// A tenant is a Padel location
const getTenants = () => {
  const url = `${PLAYTOMIC_API_URL}/tenants`;
  return axios.get(url, { params: PLAYTOMIC_API_TENANTS_PARAMS })
    .then((response) => {
      const tenants: Tenant[] = response.data; // Ensure response data conforms to Tenant type
      return tenants; // Return the tenants array
    })
    .catch((error) => {
      console.log("Error fetching tenants:", error);
      throw error; // Re-throw the error to propagate it
    });
};

const getAvailableCourtsForTenant = (tenant: Tenant, date: string) => {
  // date format: 2024-02-14
  const { defaultStartTime, defaultEndTime } = PADEL_PREFERENCES;
  const localStartMin = `${date}T${defaultStartTime}`;
  const localStartMax = `${date}T${defaultEndTime}`;
  const params = {
    user_id: "me",
    sport_id: "PADEL",
    tenant_id: tenant.tenant_id,
    local_start_min: localStartMin,
    local_start_max: localStartMax,
  };
  const url = `${PLAYTOMIC_API_URL}/availability`;
  return axios.get(url, { params })
    .then((response) => {
      const courts: Court[] = response.data;
      return courts;
    })
    .catch((error) => {
      console.log("Error fetching availability for tenant:", error);
      throw error; // Re-throw the error to propagate it
    });
};

const filterCourts = (tenant: Tenant, courts: Court[]) => {
  const { resourceSize, resourceType, minimumSlotDuration } = PADEL_PREFERENCES;
  const filteredCourts: Court[] = [];
  courts.forEach((court) => {
    // Get the court properties.
    const resource = tenant.resources.find((resource) => (
      resource.resource_id === court?.resource_id
    ));
    // Is resource type matching? Indoor or outdoor?
    const isResourceType = resource?.properties?.resource_type === resourceType;
    // Is resource size matching? Single or double?
    const isResourceSize = resource?.properties?.resource_size === resourceSize;
    // Filter slots for minimum duration.
    const applicableSlots = court.slots.filter((slot) => slot.duration >= minimumSlotDuration);

    if (applicableSlots.length > 0 && isResourceType && isResourceSize) {
      filteredCourts.push({
        ...court,
        slots: applicableSlots,
      });
    }
  });
  return filteredCourts;
};

const createMessage = (tenant: Tenant, dateObj: DateObject, availableCourts: Court[]) => {
  const addressString = `${tenant?.address.street}, ${tenant?.address.postal_code}, ` +
    `${tenant?.address.city}.`;
  const hyperlink = createHyperlink(tenant, dateObj.date);

  const courtsEmbedded = availableCourts.map((court) => ({
    title: tenant.resources.find((resource) => resource.resource_id === court?.resource_id)?.name,
    description: hyperlink,
    color: dateObj.color,
    fields: court.slots.map((slot) => ({
      name: createTimeRange(dateObj.date, slot.start_time, slot.duration),
      value: slot.price,
    })),
  }));
  const sortedEmbeds = courtsEmbedded.sort((a, b) => {
    if (a?.title && b?.title) {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const message = {
    username: tenant?.tenant_name,
    avatar_url: tenant.images && tenant.images.length > 0 ? tenant.images[0] : "",
    content: `${createFormattedDate(dateObj.date)}`,
    embeds: sortedEmbeds,
    footer: {
      text: addressString,
    },
  };
  return message;
};


//  Function is synchronous so messages will be send in order of date.
export const startPlaytomic = async () => {
  const { searchPeriodInDays, prefferedDays } = PADEL_PREFERENCES;
  // Create an array of days to check. Format ["2024-02-16"]
  const datesToCheck = getDates(searchPeriodInDays, prefferedDays);
  // Fetch all Padel tenants/locations.
  const tenants = await getTenants();
  // Filter for favourite tenants/locations.
  const favouriteTenants = tenants.filter((tenant) => (
    FAVOURITE_TENANTS.includes(tenant.tenant_uid)
  ));

  let delay = 0;
  // For each date check availability per favourite tenant.
  for (const dateToCheck of datesToCheck) {
    for (const favouriteTenant of favouriteTenants) {
      // Fetch availability for every favourite location.
      const courts = await getAvailableCourtsForTenant(favouriteTenant, dateToCheck.date);
      // Filter applicable courts for slot duration and size.
      const availableCourts = filterCourts(favouriteTenant, courts);
      if (availableCourts.length > 0) {
        const message = createMessage(favouriteTenant, dateToCheck, availableCourts);
        // Discord has a timeout for messages to prevent flooding the bot.
        setTimeout(() => {
          sendDiscordMessage(message);
        }, delay);
        delay += DISCORD_TIMEOUT_TIME;
      }
    }
  }
};


// TODO
/*

  - How to go directly to the mobile playtomic page?

  */
