const Lead = require("../models/lead.model");
const Company = require("../models/company.model");
const InCompleteLead = require("../models/inCompleteLead.model");

const calculateTrustScore = (date) => {
  const today = new Date();
  const lastUpdateDate = new Date(date);
  const timeDiff = Math.abs(today - lastUpdateDate);
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - daysDiff);
};

const processCSVData = async (csvData, fieldMappings) => {
  let leadResults = [];
  let companyResults = [];

  const updateFieldIfNewer = (existingField, newValue, newDate) => {
    if (
      !existingField ||
      new Date(newDate) > new Date(existingField.lastUpdated)
    ) {
      return { value: newValue, lastUpdated: newDate };
    }
    return existingField;
  };

  for (const row of csvData) {
    try {
      const leadData = {
        linkedInUrl: {
          value: row[fieldMappings["LinkedIn UrL"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        firstName: {
          value: row[fieldMappings["First Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        lastName: {
          value: row[fieldMappings["Last Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        email: {
          value: row[fieldMappings["Email"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        firstPhone: {
          value: row[fieldMappings["First Phone"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        title: {
          value: row[fieldMappings["Title"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        jobTitle: {
          value: row[fieldMappings["Job Title"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        seniority: {
          value: row[fieldMappings["Seniority"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        departments: {
          value: row[fieldMappings["Departments"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        workPhone: {
          value: row[fieldMappings["Work Phone"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        homePhone: {
          value: row[fieldMappings["Home Phone"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        mobilePhone: {
          value: row[fieldMappings["Mobile Phone"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        otherPhone: {
          value: row[fieldMappings["Other Phone"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        city: {
          value: row[fieldMappings["City"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        state: {
          value: row[fieldMappings["State"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        country: {
          value: row[fieldMappings["Country"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        facebook: {
          value: row[fieldMappings["Facebook"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        twitter: {
          value: row[fieldMappings["Twitter"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        pastCompanies: {
          value: row[fieldMappings["Past Companies"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
      };

      const companyData = {
        name: {
          value: row[fieldMappings["Company Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        linkedInUrl: {
          value: row[fieldMappings["Company Linkedin Url"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        address: {
          value: row[fieldMappings["Address"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        website: {
          value: row[fieldMappings["Company Website"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        phone: {
          value: row[fieldMappings["Phone numbers"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        employees: {
          value: row[fieldMappings["Employees"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        retailLocation: {
          value: row[fieldMappings["Retail Location"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        industry: {
          value: row[fieldMappings["Industry"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        keywords: {
          value: row[fieldMappings["Keywords"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        facebook: {
          value: row[fieldMappings["Facebook"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        twitter: {
          value: row[fieldMappings["Twitter"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        city: {
          value: row[fieldMappings["City"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        state: {
          value: row[fieldMappings["State"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        country: {
          value: row[fieldMappings["Country"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        seoDescription: {
          value: row[fieldMappings["SEO Description"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        technologies: {
          value: row[fieldMappings["Technologies"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        annualRevenue: {
          value: row[fieldMappings["Annual Revenue"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        totalFunding: {
          value: row[fieldMappings["Total Funding"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        latestFunding: {
          value: row[fieldMappings["Latest Funding"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        latestFundingAmount: {
          value: row[fieldMappings["Latest Funding Amount"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        lastRaisedAt: {
          value: row[fieldMappings["Last Raised At"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
      };

      // Check if the linkedInUrl is present for the lead
      if (!leadData.linkedInUrl.value) {
        console.warn("Missing LinkedIn Url for row:", row);
        const existingIncompleteLead = await InCompleteLead.findOne({
          "email.value": leadData.email.value,
        });

        if (existingIncompleteLead) {
          for (const key in leadData) {
            existingIncompleteLead[key] = updateFieldIfNewer(
              existingIncompleteLead[key],
              leadData[key].value,
              leadData[key].lastUpdated
            );
          }
          await existingIncompleteLead.save();
          leadResults.push({
            ...leadData,
            status: "updated in incomplete",
            reason: "Missing LinkedIn Url",
          });
        } else {
          const incompleteLead = new InCompleteLead(leadData);
          await incompleteLead.save();
          leadResults.push({
            ...leadData,
            status: "created in incomplete",
            reason: "Missing LinkedIn Url",
          });
        }
        continue;
      }

      // Check if the lead exists in the InCompleteLead table and has now a linkedInUrl
      const existingIncompleteLead = await InCompleteLead.findOne({
        "email.value": leadData.email.value,
      });
      if (existingIncompleteLead) {
        await InCompleteLead.deleteOne({ _id: existingIncompleteLead._id });
        const lead = new Lead(leadData);
        const data = await lead.save();
        leadResults.push({
          ...leadData,
          status: "moved from incomplete to lead",
        });
      } else {
        const existingLead = await Lead.findOne({
          $or: [
            { "email.value": leadData.email.value },
            { "linkedInUrl.value": leadData.linkedInUrl.value },
          ],
        });

        if (existingLead) {
          for (const key in leadData) {
            existingLead[key] = updateFieldIfNewer(
              existingLead[key],
              leadData[key].value,
              leadData[key].lastUpdated
            );
          }
          await existingLead.save();
          leadResults.push({ ...leadData, status: "updated" });
        } else {
          const lead = new Lead(leadData);
          const data = await lead.save();
          leadResults.push({ ...leadData, status: "created" });
        }
      }

      // Process company data
      const existingCompany = await Company.findOne({
        "linkedInUrl.value": companyData.linkedInUrl.value,
      });
      if (existingCompany) {
        for (const key in companyData) {
          existingCompany[key] = updateFieldIfNewer(
            existingCompany[key],
            companyData[key].value,
            companyData[key].lastUpdated
          );
        }
        await existingCompany.save();
        companyResults.push({ ...companyData, status: "updated" });
      } else {
        const company = new Company(companyData);
        const data = await company.save();
        companyResults.push({ ...companyData, status: "created" });
      }
    } catch (error) {
      console.error("Error processing row:", error);
      leadResults.push({
        linkedInUrl: {
          value: row[fieldMappings["LinkedIn UrL"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        firstName: {
          value: row[fieldMappings["First Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        lastName: {
          value: row[fieldMappings["Last Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        email: {
          value: row[fieldMappings["Email"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        status: "error",
        reason: error.message,
      });
      companyResults.push({
        name: {
          value: row[fieldMappings["Company Name"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        linkedInUrl: {
          value: row[fieldMappings["Company Linkedin Url"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        website: {
          value: row[fieldMappings["Company Website"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        phone: {
          value: row[fieldMappings["Phone numbers"]],
          lastUpdated: row[fieldMappings["Last Updated"]],
        },
        status: "error",
        reason: error.message,
      });
    }
  }

  return { leadResults, companyResults };
};

module.exports = { processCSVData };
